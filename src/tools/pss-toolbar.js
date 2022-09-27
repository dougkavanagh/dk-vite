var form = (function() {
	var State = {
		VERSION: "0.01",
		patientId: null,
		log : ""
	};
	var _UI = ScriptUI;//for obfuscation
	var _Util = ScriptUtil;//for obfuscation
	var POPUP_SEVERITY_THRESHOLD = Severity.ERROR;
	var HOST = "https://northehr.netlify.app";
	
	function getHost() {
		return HOST;
	}
	function getPt() {
		return _Util.getPatient();
	}
	function getPatNum() {
		return _UI.getUI().getBrowser().getPatient().getPatNum();
	}
	function getDemog() {
		return getPt().getDemographics();
	}
	function get(fName) {
		return _Util.getItemWithName(fName);
	}
	function getVal(fName) {
		var f = get(fName);
		if (!f) {
			return null;
		}
		return ""+f.getValue();
	}
	function setTempValue(f, value) {
		if (f == null) {
			log("null field: " + f + " = " + value);
			return;
		}
		if (value == null) value = "";
		if (!f.getText().equals(value)) {
			invokeLater(function() {
				f.setValue(value);
				_UI.repaintItem(f);
			});
		}
	}
	function newThread(callback) {
		new java.lang.Thread(function() {
			try { callback(); } catch (e) {}
		}, "Temp Thread").start();
	}
	function invokeLater(callback) {
		javax.swing.SwingUtilities.invokeLater(function() {
			if (!ptChanged()) {
				try { callback(); } catch (e) {}//fail silently to prevent PSS error msgs
			}
		});
	}
	function fail(e) {
		var msg = e;
		if (e.indexOf("Connection refused") >= 0)
			msg = "Unable to connect to the tablet.";
		msg = _Util.now().toTimeString(true) + ": " + msg;
		log("Error: " + msg);
	}
	var Severity =
	{
		INFO: 1,
		WARN: 2,
		ERROR: 3
	};
	function log(msg, level) {
		try {
			_Util.out("log severity " + (level || "0") + ": " + msg); 
		} catch (e) {}
		State.log += msg + "\n";
		if (level >= POPUP_SEVERITY_THRESHOLD) {
			_UI.getUI().showError(State.log);
		}
		var maxLength = 6000;
		if (State.log.length > maxLength) {
			State.log = State.log.substring(maxLength);				
		}
	}
	function showError(error) {
		log(error, Severity.ERROR);
	}
	var HttpUtils = function() {
		function openConnection(url, method) {
			var connection = url.openConnection();
			connection.setDoOutput(true);
			connection.setRequestProperty("Cache-Control", "no-cache,no-store");
			connection.setRequestProperty("Pragma", "no-cache");
			connection.setAllowUserInteraction(false);
			connection.setInstanceFollowRedirects(false);
			connection.setRequestMethod(method ? method : "GET");
			connection.setUseCaches(false);
			return connection;
		}
		function convertBytesToUrlEncoded(bytes) {
			var base64 = encodeBase64(bytes);
			var urlEncoded = encodeUrlStr(base64);
			return urlEncoded;
		}
		function encodeUrlStr(url) {
			return java.net.URLEncoder.encode(url,"UTF-8");
		}
		function postHttp(url, successFn, dataToPost, headerFields, errorFn) {
			newThread(function() {
				var con = null;
				var status = null;
				try {
					con = openConnection(url, "POST");
					if (!dataToPost) dataToPost = [];
					if (!headerFields) headerFields = {};
					headerFields["Content-Length"] = dataToPost.length;
					headerFields["Content-Type"]  = "application/octet-stream";
					// prevent timing windows when generating a new site key
					for (var i in headerFields) {
						con.setRequestProperty(i, headerFields[i]);
					}
					if (dataToPost.length > 0) con.getOutputStream().write(dataToPost);
					con.getOutputStream().flush();
					var statusHdr = con.getHeaderField("status");
					status = statusHdr ? parseInt(statusHdr) : con.getResponseCode();
					var bufferSize = 1024 * 256;//256K
					var baos = new java.io.ByteArrayOutputStream();
					var buffer = Java.type("java.lang.reflect.Array").newInstance(java.lang.Byte.TYPE, bufferSize);//256K
					var httpIn = con.getInputStream();
					while (true) {
						var len = httpIn.read(buffer, 0, buffer.length);
						if (len == -1) break;
						baos.write(buffer, 0, len);
					}
					httpIn.close();
					var respData = baos.toByteArray();
					var text = bytesToStr(respData);
					
					invokeLater(function() {
						try {
							if (Math.floor(status / 100) == 2) {
								successFn({ status: status, data: respData, text: text, con: con });
							}
							else {
								fail(status + ": " + text);
							}
							var msgToShow = con.getHeaderField("SHOW_MESSAGE");
							if (msgToShow != null) {
								_UI.note(msgToShow);
							}
						}
						catch (e) {
							showError(e);
						}
					});
				}
				catch (e) {
					log("Error: " + e);
					invokeLater(function () {
						if (errorFn) {
							errorFn(e, con.getHeaderField("error") || error);
						}
					});
				}
				finally {
					if (con != null) con.disconnect();
					setPending(false);
				}
			});
		}
		return { postHttp: postHttp, convertBytesToUrlEncoded: convertBytesToUrlEncoded, encodeUrlStr: encodeUrlStr };
	}();

	function init() {
		if (_Util.inEditor()) return;
		State.patientId = getPatNum();
		postPatient();
	}
	function newTimer(delay, cb) {
		var Timer = Java.type("javax.swing.Timer");
		return new Timer(delay, cb);
	}
	function postPatient() {
		try {
			var pssPatientID = getPatNum();
			if (!pssPatientID) {
				return;
			}
			var ptMarshalled = JSONUtils.marshalPatient(_Util.getPatient(), getVal("EmailConsent"), appts); //has to be a multiple of 16
			var patientJson = JSONUtils.stringify(ptMarshalled);

			var patientJsonBytes = strToBytes(patientJson);
			var headerFields = {};

			var urlStr = getHost() + "/fhir/$process-message?extPatientRef="+pssPatientID;
			var providerId = getDemog().getPatientDoctorId();
			var doc = (providerId) ? Java.type("netmedical.billing.BillingManager").getDoctor(providerId) : null;
			var providerName = (doc) ? doc.getName() : null;
			var clinicDoc = ptMarshalled.demographics.clinicDoc;
			if (clinicDoc) {
				var UserManager = Java.type("netmedical.application.UserManager");
				var user = UserManager.manager().getDocOrNPFromPhysNum(clinicDoc.billingNum);
			}
			var url = prepURL(urlStr);
			if (ptChanged()) {
				return;
			}
			HttpUtils.postHttp(url, function(response) {
				var responseText = response.text;
				patientUploaded(responseText);
			}, encryptedPtBlock.data, headerFields, function(error) {
				_UI.error("PS Suite could not connect to the server to upload this patient. Please confirm that your Internet is working and try again.\n\nDetails: "+error);
			});
		} catch (e) {
			_Util.log(e);
			_UI.error(e);
		}
	}
	function prepURL(urlStr) {
		urlStr += (urlStr.indexOf("?") == -1 ? "?" : "&") + "client_version=pss_cf"+State.VERSION;
		urlStr = urlStr.replace(/ /g, "%20");
		return new java.net.URL(urlStr);
	}
	
	//PatientIO
	var PatientIO = function() {
		var secureRandom = null;
		function decodeBase64(str) {
			return org.apache.commons.codec.binary.Base64.decodeBase64(strToBytes(str));
		}
		function encodeBase64(bytes) {
			return bytesToStr(org.apache.commons.codec.binary.Base64.encodeBase64(bytes));
		}
		return {
			decodeBase64: decodeBase64,
			encodeBase64: encodeBase64,
		};
	}();
	function encodeBase64(str) { return PatientIO.encodeBase64(str); }
	var JSONUtils = function() {
		function stringify(field) {
			function cleanse(field) {//convert Java objects to javascript strings for JSON (Nashorn can't stringify java strings!)
				for (var i in field) {
					if (field[i]) {
						if (field[i].toDateTimeUTCISO8601String) {
							field[i] = ""+field[i].toDateTimeUTCISO8601String().substring(0,10);
						}
						else if (field[i].getClass) {
							field[i] = ""+field[i];							
						}
						else if (typeof(field[i]) === "object"){
							cleanse(field[i]);
						}
					}
				}
			}
			cleanse(field);
			return JSON.stringify(field);
		}
		function marshalPatient(pat, emailConsent, appts) {
			var d = pat.getDemographics();
			return {
				externalPatientRef: d.getPatientId(),
				src: {v: State.CF_VERSION},
				demographics: marshalDemographics(d, emailConsent),
				chartId: d.getChartNumber(),
				cpp: marshalCPP(pat.getProfile()),
				uploadingUser: marshalUploadingUser(),
				attendingDoc: marshalAttendingDoc(),
				appts: appts,
				reasonForVisit: appts.length > 0 ? appts[0].reason : null
			};
		}
		function marshalUploadingUser() {
			var user = _Util.getUser();
			return {
				name: user ? user.getName() : ""
			};
		}
		function marshalAttendingDoc() {
			try {
				var doc = _Util.getDoctorOrUserIfNoDoctor();
				if (!doc || !doc.isDoctor() && !doc.isNursePractitioner()) return null;
				var addr = doc.getAddress();
				return {
					name: doc.getName(),
					signature: doc.getSignature(),
					billingNum: doc.getPhysNum(),
					professionalId: (doc.mProfessionalID || "").replace("CPSO:", "").replace("CPSO", "").trim(),
					address: {
						phone: doc.mPhone,
						fax: doc.mFax,
						email: doc.mEmail,
						line1: addr.getAddressLine1(),
						line2: addr.getAddressLine2(),
						city: addr.getCity(),
						province: addr.getProvince(),
						postalCode: addr.getPostalCode() || doc.mPostalCode //not populated in old versions due to PSS bug
					}
				};
			} catch (e) {
				return {name: "", address: {}};
			}
		}
		function marshalCPP(cpp) {
			var pers = cpp.getPersonalTraits();
			return {
				pmhx: marshalCPPList(cpp.getPastHealthHistory()),
				prob: marshalCPPList(cpp.getProblemList()),
				fhx: marshalCPPList(cpp.getFamilyHistory()),
				allg: marshalCPPList(cpp.getAllergies()),
				rx: marshalTxs(cpp.getTreatments(), true, false),
				tx: marshalTxs(cpp.getTreatments(), false, true),
				immu: marshalImmus(cpp.getImmunizations()),
				soc: marshalCPPList(cpp.getRiskFactors()),
				pers: pers ? marshalCPPItem({desc: pers.getText()}) : null
			};
		}
		function marshalImmus(immu) {
			var items = [];
			try {
				var immuArray = immu.getImmunizations(false).toArray();
				for (var i = 0; i < immuArray.length; i++) {
					var immu = immuArray[i];
					items.push({
						key: immu.getGenericName(),
						desc: immu.toString(),
						data: {
							id: immu.getTreatmentID(),
							date: immu.getLatestPerformedDate(),
							name: immu.getName(),
							route: immu.getRoute(),
							comments: immu.getComments(),
							reaction: immu.getReactionString()
						}
					});
				}
			} catch (e) {
				log(e);
			}
			return {
				items: items
			};
		}
		function marshalTxs(txs, includeMeds, includeNonMeds) {
			var txObjs = [];
			try {
				var txArray = txs.getActiveTreatments(null).toArray();
				for (var i = 0; i < txArray.length; i++) {
					var tx = txArray[i];
					var isMed = tx.getTreatmentType() != null && tx.getTreatmentType().value() === 0;
					if ((includeMeds && isMed) || (includeNonMeds && !isMed)) {
						txObjs.push({
							desc: tx.toString(),
							data: {
								id: tx.getTreatmentID(),
								brand: tx.getName(),
								generic: tx.getGenericName(),
								instr: tx.getInstructionsDisplayString()
							}
						});
					}
				}
			} catch (e) {
				log(e);
			}
			return {
				items: txObjs
			};
		}
		function marshalCPPItem(item) {
			function itemKey(item) {
				var text = ""+item.desc.toLowerCase();
				function has(str) {
					return text.indexOf(str) === 0 || text.indexOf(" "+text) >= 0;
				}
				return null;
			}
			var key = itemKey(item);
			return {
				key: key,
				desc: item.desc
			};
		}
		function marshalCPPList(list) {
			var items = [];
			try {
				var listItems = list.getData(null).toArray();
				if (listItems.length > 0) {
					for (var i = 0; i < listItems.length; i++) {
						var item = listItems[i];
						items.push({desc: item ? item.toString() : ""});
					}
				}
			} catch (e) {
				log(e);
			}
			return {
				items: items
			};
		}
		function marshalDemographics(d, emailConsent) {
			function getPreferredPharmacy() {
				try {
					var addrID = d.getPreferredPharmacy ? d.getPreferredPharmacy() : null;
					var ppharm = addrID ? Java.type("netmedical.addressbook.AddressBook").access().getAddressWithID(addrID) : null;
					return ppharm ? {
						name: ppharm.getName(false),
						line1: ppharm.getAddressLine1(),
						line2: ppharm.getAddressLine2(),
						city: ppharm.getCity(),
						province: ppharm.getProvince(),
						postalCode: ppharm.getPostalCode(),
						phone: ppharm.getPhone(),
						fax: ppharm.getFax()
					} : null;
				} catch (e) {
					return null;
				}
			}
			var sex = ""+d.getSex();
			if (sex != "F" && sex != "M") {
				sex = null;
			}
			var ec = null;
			if (d.getNextOfKin() != null) {
				var emergContactInfo = splitEmergencyContactArray(d.getNextOfKin()||"");
				var PoA = emergContactInfo[3].trim();
				var PoAParts = PoA.split(':');
				// should be in format "PoA:Y", "PoA:U" or "PoA:N"; we only want Y,N or U
				ec = {
					emergencyContact: emergContactInfo[0].trim(),
					emergencyContactPhone: emergContactInfo[1].trim(),
					emergencyContactRelationship: emergContactInfo[2].trim(),	
					emergencyContactIsPoA: PoAParts[1] ? PoAParts[1] : null 
				};
			}
			emailConsent = (""+emailConsent).toLowerCase();
			if (emailConsent === "never done") emailConsent = null;
			if (emailConsent === "granted") emailConsent = "Y";
			if (emailConsent === "refused") emailConsent = "N";

			var memberStatus = d.getMemberStatus();
			try { memberStatus = (Java.type("netmedical.billing.PaymentPrograms")).access().getProgramMap().get(memberStatus); } catch(e) {}
			var dObj = {
				firstName: d.getFirstName(),
				surname: d.getSurname(),
				preferredName: d.getPreferredName(),
				secondName: d.getSecondName(),
				title: d.getTitle(),
				suffix: d.getSuffix(),
				hn: d.getHealthNumber(),
				hnProv: d.getHnProvince(),
				hnVC: d.getHnVersionCode(),
				hnExpiryDate: d.getCardExpiryDate(),
				maidenName: d.getMaidenName(),
				birthDate: d.getBirthDate(),
				sex: sex,
				address: marshalPtAddress(d),
				address2: marshalPtResAddress(d),
				clinicDoc: marshalClinicDoc(d),
				familyDoc: marshalFamilyDoc(d),
				insuranceNumber: d.getInsuranceNumber(),
				language: EmrFieldBinding.getSpokenLanguage(d),
				memberStatus: memberStatus,
				diagnosis: d.getDiagnosis(),
				emergencyContact: ec ? ec.emergencyContact : null,
				emergencyContactPhone: ec ? ec.emergencyContactPhone : null,
				emergencyContactRelationship: ec ? ec.emergencyContactRelationship : null, 	
				emergencyContactIsPoA: ec ? ec.emergencyContactIsPoA : null,
				emailConsent: emailConsent,
				comments: d.getComments(),
				preferredPharmacy: getPreferredPharmacy(),
				blockFeeExpiryDate: d.getBlockFeeExpiryDate()
			};
			return dObj;
		}
		function marshalPtAddress(d) {
			var address = {};
			try {
				address.email = d.getEmail();
				address.homePhone = d.getHomePhone();
				address.mobilePhone = EmrFieldBinding.getMobilePhone(d);
				var businessPhone = d.getBusinessPhone();
				var extension = null;
				if (businessPhone) {
					var businessPhoneVal = businessPhone.toString();
					try {
						extension = businessPhone.getExtension();
						businessPhone.setExtension(0);
						businessPhoneVal = businessPhone.toString();
						businessPhone.setExtension(extension);//not necessary since local copy but playing safe
					} catch (e) {}
				}
				address.businessPhone = businessPhoneVal;
				address.businessPhoneExt = extension != 0 ? extension : null;
				address.line1 = d.getStreetAddress1();
				address.streetNumber = d.getStreetNumber();
				address.streetAddress = d.getAddressLine1Data();
				address.line2 = d.getStreetAddress2();
				address.line2Label = EmrFieldBinding.getLine2Label(d.getMailExtraLabel());
				address.city = d.getCity();
				address.province = d.getProvince();
				address.country = d.getCountry();
				address.postalCode = d.getPostalCode();
				try {
					address.pmoc = d.getPreferredMethodOfContact() ? d.getPreferredMethodOfContact().name() : null;
				} catch (e) {}
			} catch (e) {
				address.error = e;
			}
			return address;
		}
		function marshalPtResAddress(d) {
			return {
				line1: d.getResStreetNum() ? (d.getResStreetNum() + " " + d.getResAddrLine1()).trim() : d.getResAddrLine1(),
				streetNumber: d.getResStreetNum(),
				streetAddress: d.getResAddrLine1(),
				line2: d.getResAddrLine2(),
				line2Label: EmrFieldBinding.getLine2Label(d.getResExtraLabel()),
				city: d.getResCity(),
				province: d.getResProv(),
				country: d.getResCountry(),
				postalCode: d.getResPostal()
			};
		}
		function marshalFamilyDoc(d) {
			if (d.getFamilyMd()) {
				return {
					name: d.getFamilyMd().getName()
				};
			}
			return null;
		}
		function marshalClinicDoc(d) {
			try {
				var docId = d.getPatientDoctorId();
				var doc = Java.type("netmedical.billing.BillingManager").getDoctor(docId);
				return doc ? {
					name: doc.getName(),
					signature: doc.getName(),//no specific signature for billing doc
					billingNum: doc.getPhysNum()
				} : {name: ""};
			}
			catch (e) {
				log(e);
				return null;
			}
		}
	
		//JSON Parsing 
		function parseJSON(json) {
			if (!json) { return null; }
			return JSON.parse(json);
		}
		return {
			parseJSON: parseJSON, marshalPatient: marshalPatient,
			marshalTxs: marshalTxs, marshalCPP: marshalCPP, stringify: stringify
		};
	}();
	function strToBytes(str) {
		return new java.lang.String(str ? str : "").getBytes("UTF-8");
	}
	function bytesToStr(bytes) {
		if (!bytes) {
			return "";
		}
		return ""+new java.lang.String(bytes, "UTF-8");
	}
	return {
		init: init,
	};
})();
function init() {
	form.init();
}