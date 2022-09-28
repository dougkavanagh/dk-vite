import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from './context';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: any;
};

export type Address = {
  __typename?: 'Address';
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  line?: Maybe<Array<Scalars['String']>>;
  postalCode?: Maybe<Scalars['String']>;
  province?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  use?: Maybe<Scalars['String']>;
};

export type AddressInput = {
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  line?: InputMaybe<Array<Scalars['String']>>;
  postalCode?: InputMaybe<Scalars['String']>;
  province?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  use?: InputMaybe<Scalars['String']>;
};

export type Appointment = {
  __typename?: 'Appointment';
  _id?: Maybe<Scalars['ID']>;
  actor?: Maybe<Array<Reference>>;
  appointmentType?: Maybe<Code>;
  basedOn?: Maybe<Reference>;
  cancellationReason?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  end?: Maybe<Scalars['DateTime']>;
  participants?: Maybe<Array<Participant>>;
  patientInstruction?: Maybe<Scalars['String']>;
  reason?: Maybe<Array<Code>>;
  schedule?: Maybe<Array<Reference>>;
  serviceCategory?: Maybe<Array<Code>>;
  serviceType?: Maybe<Array<Code>>;
  specialty?: Maybe<Array<Code>>;
  start?: Maybe<Scalars['DateTime']>;
  status?: Maybe<AppointmentStatus>;
  subject?: Maybe<Array<Reference>>;
};

export type AppointmentInput = {
  _id?: InputMaybe<Scalars['ID']>;
  actor?: InputMaybe<Array<ReferenceInput>>;
  appointmentType?: InputMaybe<CodeInput>;
  basedOn?: InputMaybe<ReferenceInput>;
  cancellationReason?: InputMaybe<Scalars['String']>;
  comment?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  end?: InputMaybe<Scalars['DateTime']>;
  participants?: InputMaybe<Array<ParticipantInput>>;
  patientInstruction?: InputMaybe<Scalars['String']>;
  reason?: InputMaybe<Array<CodeInput>>;
  schedule?: InputMaybe<Array<ReferenceInput>>;
  serviceCategory?: InputMaybe<Array<CodeInput>>;
  serviceType?: InputMaybe<Array<CodeInput>>;
  specialty?: InputMaybe<Array<CodeInput>>;
  start?: InputMaybe<Scalars['DateTime']>;
  status?: InputMaybe<AppointmentStatus>;
  subject?: InputMaybe<Array<ReferenceInput>>;
};

export enum AppointmentStatus {
  Arrived = 'ARRIVED',
  Booked = 'BOOKED',
  Cancelled = 'CANCELLED',
  Checkedin = 'CHECKEDIN',
  Enteredinerror = 'ENTEREDINERROR',
  Fulfilled = 'FULFILLED',
  Noshow = 'NOSHOW',
  Pending = 'PENDING',
  Proposed = 'PROPOSED',
  Waitlist = 'WAITLIST'
}

export type AttachmentInput = {
  contentType?: InputMaybe<Scalars['String']>;
  hash?: InputMaybe<Scalars['String']>;
  language?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  text?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};

export type CareTeam = {
  __typename?: 'CareTeam';
  participants: Array<CareTeamParticipant>;
};

export type CareTeamInput = {
  participants: Array<CareTeamParticipantInput>;
};

export type CareTeamParticipant = {
  __typename?: 'CareTeamParticipant';
  delegateOfPractitionerId?: Maybe<Scalars['String']>;
  delegationType?: Maybe<Scalars['String']>;
  expiryDate?: Maybe<Scalars['DateTime']>;
  note?: Maybe<Scalars['String']>;
  organization?: Maybe<Organization>;
  practitioner?: Maybe<Practitioner>;
  role: Scalars['String'];
};

export type CareTeamParticipantInput = {
  delegateOfPractitionerId?: InputMaybe<Scalars['String']>;
  delegationType?: InputMaybe<Scalars['String']>;
  expiryDate?: InputMaybe<Scalars['DateTime']>;
  note?: InputMaybe<Scalars['String']>;
  organization?: InputMaybe<OrganizationInput>;
  practitioner?: InputMaybe<PractitionerInput>;
  role: Scalars['String'];
};

export type Code = {
  __typename?: 'Code';
  text?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type CodeInput = {
  text: Scalars['String'];
  value: Scalars['String'];
};

export type Contact = {
  __typename?: 'Contact';
  address?: Maybe<Address>;
  gender?: Maybe<GenderInfo>;
  name?: Maybe<Name>;
  purpose?: Maybe<Scalars['String']>;
  telecom?: Maybe<Array<ContactPoint>>;
};

export type ContactInput = {
  address?: InputMaybe<AddressInput>;
  gender?: InputMaybe<GenderInfoInput>;
  name?: InputMaybe<NameInput>;
  purpose?: InputMaybe<Scalars['String']>;
  telecom?: InputMaybe<Array<ContactPointInput>>;
};

export type ContactPoint = {
  __typename?: 'ContactPoint';
  rank?: Maybe<Scalars['Int']>;
  system?: Maybe<Scalars['String']>;
  use?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

export type ContactPointInput = {
  rank?: InputMaybe<Scalars['Int']>;
  use: Scalars['String'];
  value: Scalars['String'];
};

export type ContentInput = {
  attachment: AttachmentInput;
};

export type CppSection = {
  __typename?: 'CppSection';
  title: Scalars['String'];
};

export type DbFile = {
  __typename?: 'DbFile';
  _id: Scalars['ID'];
  fileName: Scalars['String'];
  mimeType: Scalars['String'];
  ownerId: Scalars['String'];
  usedFor: Scalars['String'];
};

export type DeceasedInfo = {
  __typename?: 'DeceasedInfo';
  deceasedBoolean: Scalars['Boolean'];
  deceasedDateTime?: Maybe<Scalars['DateTime']>;
};

export type DeceasedInfoInput = {
  deceasedBoolean: Scalars['Boolean'];
  deceasedDateTime?: InputMaybe<Scalars['DateTime']>;
};

export type DocumentReferenceInput = {
  _id?: InputMaybe<Scalars['ID']>;
  authenticator?: InputMaybe<ReferenceInput>;
  author?: InputMaybe<Array<ReferenceInput>>;
  base: PtResourceInput;
  category?: InputMaybe<Array<CodeInput>>;
  content: Array<ContentInput>;
  description?: InputMaybe<Scalars['String']>;
  docType: CodeInput;
  identifier?: InputMaybe<Array<IdentifierInput>>;
  note: Scalars['String'];
  ptId: Scalars['String'];
};

export type Error = {
  __typename?: 'Error';
  code?: Maybe<Scalars['String']>;
  message: Scalars['String'];
};

export type Extension = {
  __typename?: 'Extension';
  id?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type ExtensionInput = {
  id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export type Gender = {
  __typename?: 'Gender';
  context?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

export type GenderInfo = {
  __typename?: 'GenderInfo';
  identity?: Maybe<Gender>;
  pronouns?: Maybe<Pronouns>;
  recordedSexOrGender?: Maybe<Code>;
  sexForClinicalUse?: Maybe<Code>;
};

export type GenderInfoInput = {
  identity?: InputMaybe<GenderInput>;
  pronouns?: InputMaybe<PronounsInput>;
  recordedSexOrGender?: InputMaybe<CodeInput>;
  sexForClinicalUse?: InputMaybe<CodeInput>;
};

export type GenderInput = {
  context?: InputMaybe<Scalars['String']>;
  value: Scalars['String'];
};

export type Identifier = {
  __typename?: 'Identifier';
  ext?: Maybe<Extension>;
  type?: Maybe<Code>;
  value?: Maybe<Scalars['String']>;
};

export type IdentifierInput = {
  ext?: InputMaybe<ExtensionInput>;
  type?: InputMaybe<CodeInput>;
  value?: InputMaybe<Scalars['String']>;
};

export type Language = {
  __typename?: 'Language';
  code: Scalars['String'];
  preferred?: Maybe<Scalars['Boolean']>;
};

export type LanguageInput = {
  code: Scalars['String'];
  preferred?: InputMaybe<Scalars['Boolean']>;
};

export type LocationInput = {
  address: AddressInput;
  contact?: InputMaybe<Array<ContactInput>>;
  name: Scalars['String'];
  status: Scalars['String'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  rememberMe: Scalars['Boolean'];
  returnJwt?: InputMaybe<Scalars['Boolean']>;
  siteId?: InputMaybe<Scalars['String']>;
};

export type LoginResult = {
  __typename?: 'LoginResult';
  jwt?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  addAppointment: SaveResult;
  addCredentials?: Maybe<Error>;
  addPractitioner: SaveResult;
  addSchedule: SaveResult;
  addSite?: Maybe<Error>;
  addSlot: SaveResult;
  changePassword?: Maybe<Error>;
  deleteAppointment: SaveResult;
  deletePractitioner: SaveResult;
  deleteSchedule: SaveResult;
  deleteSlot: SaveResult;
  login: LoginResult;
  logout: Scalars['Boolean'];
  removeCredentials?: Maybe<Error>;
  resetPassword?: Maybe<Error>;
  saveDocumentReference: SaveResult;
  savePatient: SaveResult;
  sendResetPasswordEmail?: Maybe<Error>;
  sendSms?: Maybe<Result>;
  setAdmin?: Maybe<Error>;
  setDisplayName?: Maybe<Error>;
  setSiteAccess?: Maybe<Error>;
  signup?: Maybe<Error>;
  updateAppointment: SaveResult;
  updatePractitioner: SaveResult;
  updateSchedule: SaveResult;
  updateSite?: Maybe<Error>;
  updateSlot: SaveResult;
  viewCredential?: Maybe<SiteCredentials>;
};


export type MutationAddAppointmentArgs = {
  appointment: AppointmentInput;
};


export type MutationAddCredentialsArgs = {
  credentials: SiteCredentialsInput;
};


export type MutationAddPractitionerArgs = {
  practitioner: PractitionerInput;
};


export type MutationAddScheduleArgs = {
  schedule: ScheduleInput;
};


export type MutationAddSiteArgs = {
  site: NewSiteInput;
};


export type MutationAddSlotArgs = {
  appointment: SlotInput;
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
  twoFactorToken?: InputMaybe<Scalars['String']>;
  userId: Scalars['String'];
};


export type MutationDeleteAppointmentArgs = {
  id: Scalars['String'];
};


export type MutationDeletePractitionerArgs = {
  id: Scalars['String'];
};


export type MutationDeleteScheduleArgs = {
  id: Scalars['String'];
};


export type MutationDeleteSlotArgs = {
  id: Scalars['String'];
};


export type MutationLoginArgs = {
  creds: LoginInput;
};


export type MutationRemoveCredentialsArgs = {
  clientId: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  email: Scalars['String'];
  newPassword: Scalars['String'];
  token: Scalars['String'];
  twoFactorToken?: InputMaybe<Scalars['String']>;
};


export type MutationSaveDocumentReferenceArgs = {
  resource: DocumentReferenceInput;
};


export type MutationSavePatientArgs = {
  patient: PatientInput;
};


export type MutationSendResetPasswordEmailArgs = {
  email: Scalars['String'];
};


export type MutationSendSmsArgs = {
  params: SmsInput;
};


export type MutationSetAdminArgs = {
  admin: Scalars['Boolean'];
  userId: Scalars['String'];
};


export type MutationSetDisplayNameArgs = {
  displayName: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationSetSiteAccessArgs = {
  access: Scalars['Boolean'];
  defaultSite?: InputMaybe<Scalars['Boolean']>;
  userId: Scalars['String'];
};


export type MutationSignupArgs = {
  user: NewUserInput;
};


export type MutationUpdateAppointmentArgs = {
  appointment: AppointmentInput;
};


export type MutationUpdatePractitionerArgs = {
  practitioner: PractitionerInput;
};


export type MutationUpdateScheduleArgs = {
  schedule: ScheduleInput;
};


export type MutationUpdateSiteArgs = {
  site: SiteInput;
};


export type MutationUpdateSlotArgs = {
  appointment: SlotInput;
};


export type MutationViewCredentialArgs = {
  clientId: Scalars['String'];
};

export type Name = {
  __typename?: 'Name';
  family: Scalars['String'];
  given: Array<Scalars['String']>;
  prefix?: Maybe<Scalars['String']>;
  suffix?: Maybe<Scalars['String']>;
  use?: Maybe<Scalars['String']>;
};

export type NameInput = {
  family: Scalars['String'];
  given: Array<Scalars['String']>;
  prefix?: InputMaybe<Scalars['String']>;
  suffix?: InputMaybe<Scalars['String']>;
  use?: InputMaybe<Scalars['String']>;
};

export type NewSiteInput = {
  location: LocationInput;
  title: Scalars['String'];
};

export type NewUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  siteToJoin?: InputMaybe<Scalars['String']>;
};

export type Organization = {
  __typename?: 'Organization';
  contacts?: Maybe<Array<Contact>>;
  kind: Scalars['String'];
  name: Scalars['String'];
};

export type OrganizationInput = {
  contacts?: InputMaybe<Array<ContactInput>>;
  kind: Scalars['String'];
  name: Scalars['String'];
};

export type Participant = {
  __typename?: 'Participant';
  actor?: Maybe<Reference>;
  status?: Maybe<ParticipationStatus>;
  type?: Maybe<ParticipantType>;
};

export type ParticipantInput = {
  actor?: InputMaybe<ReferenceInput>;
  status?: InputMaybe<ParticipationStatus>;
  type?: InputMaybe<ParticipantType>;
};

export enum ParticipantType {
  Patient = 'PATIENT',
  Pracitioner = 'PRACITIONER'
}

export enum ParticipationStatus {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  NeedsAction = 'NEEDS_ACTION',
  Tentative = 'TENTATIVE'
}

export type Patient = {
  __typename?: 'Patient';
  _id: Scalars['ID'];
  address?: Maybe<Array<Address>>;
  birthDate?: Maybe<Scalars['String']>;
  careTeam?: Maybe<CareTeam>;
  contacts?: Maybe<Array<PatientContact>>;
  deceased?: Maybe<DeceasedInfo>;
  gender?: Maybe<GenderInfo>;
  languages?: Maybe<Array<Language>>;
  maritalStatus?: Maybe<Code>;
  name: Array<Name>;
  photo?: Maybe<Array<DbFile>>;
  telecom: Array<ContactPoint>;
};

export type PatientChart = {
  __typename?: 'PatientChart';
  cpp?: Maybe<Array<CppSection>>;
  error?: Maybe<Error>;
  patient?: Maybe<Patient>;
  resources?: Maybe<Array<PtResource>>;
  siteInfo?: Maybe<SiteInfo>;
};

export type PatientContact = {
  __typename?: 'PatientContact';
  contact?: Maybe<Contact>;
  forEmergency?: Maybe<Scalars['Boolean']>;
  poa?: Maybe<Scalars['Boolean']>;
  relationship?: Maybe<Scalars['String']>;
};

export type PatientContactInput = {
  contact: ContactInput;
  forEmergency?: InputMaybe<Scalars['Boolean']>;
  poa?: InputMaybe<Scalars['Boolean']>;
  relationship?: InputMaybe<Scalars['String']>;
};

export type PatientInput = {
  address?: InputMaybe<Array<AddressInput>>;
  birthDate?: InputMaybe<Scalars['String']>;
  careTeam?: InputMaybe<CareTeamInput>;
  contacts?: InputMaybe<Array<PatientContactInput>>;
  deceased?: InputMaybe<DeceasedInfoInput>;
  gender?: InputMaybe<GenderInfoInput>;
  languages?: InputMaybe<Array<LanguageInput>>;
  maritalStatus?: InputMaybe<CodeInput>;
  name: Array<NameInput>;
  telecom: Array<ContactPointInput>;
};

export type Period = {
  __typename?: 'Period';
  end?: Maybe<Scalars['DateTime']>;
  start?: Maybe<Scalars['DateTime']>;
};

export type PeriodInput = {
  end?: InputMaybe<Scalars['DateTime']>;
  start?: InputMaybe<Scalars['DateTime']>;
};

export type Practitioner = {
  __typename?: 'Practitioner';
  billingId?: Maybe<Scalars['String']>;
  birthDate?: Maybe<Scalars['String']>;
  gender?: Maybe<GenderInfo>;
  name: Name;
  professionalId?: Maybe<Scalars['String']>;
  qualifications?: Maybe<Array<Maybe<Qualification>>>;
};

export type PractitionerInput = {
  _id?: InputMaybe<Scalars['ID']>;
  billingId?: InputMaybe<Scalars['String']>;
  birthDate?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<GenderInfoInput>;
  name: NameInput;
  professionalId?: InputMaybe<Scalars['String']>;
  qualifications?: InputMaybe<Array<QualificationInput>>;
};

export type Profile = {
  __typename?: 'Profile';
  displayName: Scalars['String'];
};

export type Pronouns = {
  __typename?: 'Pronouns';
  object?: Maybe<Scalars['String']>;
  possessive?: Maybe<Scalars['String']>;
  self?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type PronounsInput = {
  object?: InputMaybe<Scalars['String']>;
  possessive?: InputMaybe<Scalars['String']>;
  self?: InputMaybe<Scalars['String']>;
  subject?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
};

export type PtResource = {
  _id: Scalars['ID'];
  ptId: Scalars['String'];
};

export type PtResourceInput = {
  ptId: Scalars['String'];
  siteId: Scalars['String'];
};

export type Qualification = {
  __typename?: 'Qualification';
  code: Code;
};

export type QualificationInput = {
  code: CodeInput;
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  currentUser?: Maybe<SessionUser>;
  empty?: Maybe<Scalars['String']>;
  findByPatientId?: Maybe<PatientChart>;
  findRecentPatients: Array<Patient>;
  getAppointment?: Maybe<Appointment>;
  getAppointmentReasons?: Maybe<Array<Code>>;
  getAppointmentTypes?: Maybe<Array<Code>>;
  getAppointments?: Maybe<Array<Appointment>>;
  getPractitioner?: Maybe<Practitioner>;
  getPractitionersBySite?: Maybe<Array<Practitioner>>;
  getSchedule?: Maybe<Schedule>;
  getScheduleCodes?: Maybe<Array<Code>>;
  getSchedules?: Maybe<Array<Maybe<Schedule>>>;
  getSites: Array<Site>;
  getSlots?: Maybe<Array<Slot>>;
  listCredentials: Array<SiteCredentialsListItem>;
  user?: Maybe<Array<Maybe<User>>>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryFindByPatientIdArgs = {
  ptId: Scalars['String'];
};


export type QueryGetAppointmentArgs = {
  _id: Scalars['ID'];
};


export type QueryGetAppointmentsArgs = {
  end: Scalars['DateTime'];
  scheduleId: Scalars['ID'];
  start: Scalars['DateTime'];
};


export type QueryGetPractitionerArgs = {
  id: Scalars['String'];
};


export type QueryGetPractitionersBySiteArgs = {
  siteId: Scalars['String'];
};


export type QueryGetScheduleArgs = {
  _id: Scalars['ID'];
};


export type QueryGetSlotsArgs = {
  end: Scalars['DateTime'];
  scheduleId: Scalars['ID'];
  start: Scalars['DateTime'];
};


export type QueryUserArgs = {
  email: Scalars['String'];
};

export type Reference = {
  __typename?: 'Reference';
  display?: Maybe<Scalars['String']>;
  identifiSaveResult?: Maybe<Identifier>;
  reference?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type ReferenceInput = {
  display?: InputMaybe<Scalars['String']>;
  identifier?: InputMaybe<IdentifierInput>;
  reference?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type Result = {
  __typename?: 'Result';
  error?: Maybe<Scalars['String']>;
};

export type Roles = {
  __typename?: 'Roles';
  admin: Scalars['Boolean'];
};

export type SaveResult = {
  __typename?: 'SaveResult';
  error?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
};

export type Schedule = {
  __typename?: 'Schedule';
  _id: Scalars['ID'];
  active?: Maybe<Scalars['Boolean']>;
  actor?: Maybe<Array<Reference>>;
  comment?: Maybe<Scalars['String']>;
  planningHorizon?: Maybe<Period>;
  serviceCategory?: Maybe<Array<Code>>;
  serviceType?: Maybe<Array<Code>>;
  specialty?: Maybe<Array<Code>>;
};

export type ScheduleInput = {
  actor: Array<ReferenceInput>;
  comment?: InputMaybe<Scalars['String']>;
  planningHorizon?: InputMaybe<PeriodInput>;
  serviceCategory?: InputMaybe<Array<CodeInput>>;
  serviceType?: InputMaybe<Array<CodeInput>>;
  specialty?: InputMaybe<Array<CodeInput>>;
};

export type SessionUser = {
  __typename?: 'SessionUser';
  email?: Maybe<Scalars['String']>;
  profile: SessionUserProfile;
  roles: SessionUserRoles;
};

export type SessionUserProfile = {
  __typename?: 'SessionUserProfile';
  displayName: Scalars['String'];
};

export type SessionUserRoles = {
  __typename?: 'SessionUserRoles';
  admin: Scalars['Boolean'];
};

export type Site = {
  __typename?: 'Site';
  id: Scalars['String'];
  title: Scalars['String'];
};

export type SiteCredentials = {
  __typename?: 'SiteCredentials';
  clientId: Scalars['String'];
  clientSecret: Scalars['String'];
  name: Scalars['String'];
};

export type SiteCredentialsInput = {
  name: Scalars['String'];
};

export type SiteCredentialsListItem = {
  __typename?: 'SiteCredentialsListItem';
  clientId: Scalars['String'];
  name: Scalars['String'];
};

export type SiteInfo = {
  __typename?: 'SiteInfo';
  status: Scalars['String'];
};

export type SiteInput = {
  siteId: Scalars['String'];
  title: Scalars['String'];
};

export type Slot = {
  __typename?: 'Slot';
  _id: Scalars['ID'];
  appointmentType?: Maybe<Code>;
  comments?: Maybe<Scalars['String']>;
  end?: Maybe<Scalars['DateTime']>;
  scheduleId: Scalars['ID'];
  serviceCategory?: Maybe<Array<Code>>;
  serviceType?: Maybe<Array<Code>>;
  specialty?: Maybe<Array<Code>>;
  start?: Maybe<Scalars['DateTime']>;
  status: SlotStatus;
};

export type SlotInput = {
  _id?: InputMaybe<Scalars['ID']>;
  appointmentType?: InputMaybe<CodeInput>;
  comments?: InputMaybe<Scalars['String']>;
  end?: InputMaybe<Scalars['DateTime']>;
  scheduleId: Scalars['ID'];
  serviceCategory?: InputMaybe<Array<CodeInput>>;
  serviceType?: InputMaybe<Array<CodeInput>>;
  specialty?: InputMaybe<Array<CodeInput>>;
  start?: InputMaybe<Scalars['DateTime']>;
  status: SlotStatus;
};

export enum SlotStatus {
  Busy = 'BUSY',
  Free = 'FREE'
}

export type SmsInput = {
  target: Scalars['String'];
  targetDescription?: InputMaybe<Scalars['String']>;
  text: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['String'];
  email: Scalars['String'];
  profile: Profile;
  roles: Roles;
  tagLine?: Maybe<Scalars['String']>;
};

export type ValueSetItem = {
  __typename?: 'ValueSetItem';
  _id: Scalars['ID'];
  text?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type ValueSetItemInput = {
  _id?: InputMaybe<Scalars['ID']>;
  text?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export type Xyz = {
  __typename?: 'XYZ';
  test?: Maybe<Scalars['String']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Address: ResolverTypeWrapper<Address>;
  AddressInput: AddressInput;
  Appointment: ResolverTypeWrapper<Appointment>;
  AppointmentInput: AppointmentInput;
  AppointmentStatus: AppointmentStatus;
  AttachmentInput: AttachmentInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CareTeam: ResolverTypeWrapper<CareTeam>;
  CareTeamInput: CareTeamInput;
  CareTeamParticipant: ResolverTypeWrapper<CareTeamParticipant>;
  CareTeamParticipantInput: CareTeamParticipantInput;
  Code: ResolverTypeWrapper<Code>;
  CodeInput: CodeInput;
  Contact: ResolverTypeWrapper<Contact>;
  ContactInput: ContactInput;
  ContactPoint: ResolverTypeWrapper<ContactPoint>;
  ContactPointInput: ContactPointInput;
  ContentInput: ContentInput;
  CppSection: ResolverTypeWrapper<CppSection>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  DbFile: ResolverTypeWrapper<DbFile>;
  DeceasedInfo: ResolverTypeWrapper<DeceasedInfo>;
  DeceasedInfoInput: DeceasedInfoInput;
  DocumentReferenceInput: DocumentReferenceInput;
  Error: ResolverTypeWrapper<Error>;
  Extension: ResolverTypeWrapper<Extension>;
  ExtensionInput: ExtensionInput;
  Gender: ResolverTypeWrapper<Gender>;
  GenderInfo: ResolverTypeWrapper<GenderInfo>;
  GenderInfoInput: GenderInfoInput;
  GenderInput: GenderInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Identifier: ResolverTypeWrapper<Identifier>;
  IdentifierInput: IdentifierInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Language: ResolverTypeWrapper<Language>;
  LanguageInput: LanguageInput;
  LocationInput: LocationInput;
  LoginInput: LoginInput;
  LoginResult: ResolverTypeWrapper<LoginResult>;
  Mutation: ResolverTypeWrapper<{}>;
  Name: ResolverTypeWrapper<Name>;
  NameInput: NameInput;
  NewSiteInput: NewSiteInput;
  NewUserInput: NewUserInput;
  Organization: ResolverTypeWrapper<Organization>;
  OrganizationInput: OrganizationInput;
  Participant: ResolverTypeWrapper<Participant>;
  ParticipantInput: ParticipantInput;
  ParticipantType: ParticipantType;
  ParticipationStatus: ParticipationStatus;
  Patient: ResolverTypeWrapper<Patient>;
  PatientChart: ResolverTypeWrapper<PatientChart>;
  PatientContact: ResolverTypeWrapper<PatientContact>;
  PatientContactInput: PatientContactInput;
  PatientInput: PatientInput;
  Period: ResolverTypeWrapper<Period>;
  PeriodInput: PeriodInput;
  Practitioner: ResolverTypeWrapper<Practitioner>;
  PractitionerInput: PractitionerInput;
  Profile: ResolverTypeWrapper<Profile>;
  Pronouns: ResolverTypeWrapper<Pronouns>;
  PronounsInput: PronounsInput;
  PtResource: never;
  PtResourceInput: PtResourceInput;
  Qualification: ResolverTypeWrapper<Qualification>;
  QualificationInput: QualificationInput;
  Query: ResolverTypeWrapper<{}>;
  Reference: ResolverTypeWrapper<Reference>;
  ReferenceInput: ReferenceInput;
  Result: ResolverTypeWrapper<Result>;
  Roles: ResolverTypeWrapper<Roles>;
  SaveResult: ResolverTypeWrapper<SaveResult>;
  Schedule: ResolverTypeWrapper<Schedule>;
  ScheduleInput: ScheduleInput;
  SessionUser: ResolverTypeWrapper<SessionUser>;
  SessionUserProfile: ResolverTypeWrapper<SessionUserProfile>;
  SessionUserRoles: ResolverTypeWrapper<SessionUserRoles>;
  Site: ResolverTypeWrapper<Site>;
  SiteCredentials: ResolverTypeWrapper<SiteCredentials>;
  SiteCredentialsInput: SiteCredentialsInput;
  SiteCredentialsListItem: ResolverTypeWrapper<SiteCredentialsListItem>;
  SiteInfo: ResolverTypeWrapper<SiteInfo>;
  SiteInput: SiteInput;
  Slot: ResolverTypeWrapper<Slot>;
  SlotInput: SlotInput;
  SlotStatus: SlotStatus;
  SmsInput: SmsInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
  ValueSetItem: ResolverTypeWrapper<ValueSetItem>;
  ValueSetItemInput: ValueSetItemInput;
  XYZ: ResolverTypeWrapper<Xyz>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Address: Address;
  AddressInput: AddressInput;
  Appointment: Appointment;
  AppointmentInput: AppointmentInput;
  AttachmentInput: AttachmentInput;
  Boolean: Scalars['Boolean'];
  CareTeam: CareTeam;
  CareTeamInput: CareTeamInput;
  CareTeamParticipant: CareTeamParticipant;
  CareTeamParticipantInput: CareTeamParticipantInput;
  Code: Code;
  CodeInput: CodeInput;
  Contact: Contact;
  ContactInput: ContactInput;
  ContactPoint: ContactPoint;
  ContactPointInput: ContactPointInput;
  ContentInput: ContentInput;
  CppSection: CppSection;
  Date: Scalars['Date'];
  DateTime: Scalars['DateTime'];
  DbFile: DbFile;
  DeceasedInfo: DeceasedInfo;
  DeceasedInfoInput: DeceasedInfoInput;
  DocumentReferenceInput: DocumentReferenceInput;
  Error: Error;
  Extension: Extension;
  ExtensionInput: ExtensionInput;
  Gender: Gender;
  GenderInfo: GenderInfo;
  GenderInfoInput: GenderInfoInput;
  GenderInput: GenderInput;
  ID: Scalars['ID'];
  Identifier: Identifier;
  IdentifierInput: IdentifierInput;
  Int: Scalars['Int'];
  Language: Language;
  LanguageInput: LanguageInput;
  LocationInput: LocationInput;
  LoginInput: LoginInput;
  LoginResult: LoginResult;
  Mutation: {};
  Name: Name;
  NameInput: NameInput;
  NewSiteInput: NewSiteInput;
  NewUserInput: NewUserInput;
  Organization: Organization;
  OrganizationInput: OrganizationInput;
  Participant: Participant;
  ParticipantInput: ParticipantInput;
  Patient: Patient;
  PatientChart: PatientChart;
  PatientContact: PatientContact;
  PatientContactInput: PatientContactInput;
  PatientInput: PatientInput;
  Period: Period;
  PeriodInput: PeriodInput;
  Practitioner: Practitioner;
  PractitionerInput: PractitionerInput;
  Profile: Profile;
  Pronouns: Pronouns;
  PronounsInput: PronounsInput;
  PtResource: never;
  PtResourceInput: PtResourceInput;
  Qualification: Qualification;
  QualificationInput: QualificationInput;
  Query: {};
  Reference: Reference;
  ReferenceInput: ReferenceInput;
  Result: Result;
  Roles: Roles;
  SaveResult: SaveResult;
  Schedule: Schedule;
  ScheduleInput: ScheduleInput;
  SessionUser: SessionUser;
  SessionUserProfile: SessionUserProfile;
  SessionUserRoles: SessionUserRoles;
  Site: Site;
  SiteCredentials: SiteCredentials;
  SiteCredentialsInput: SiteCredentialsInput;
  SiteCredentialsListItem: SiteCredentialsListItem;
  SiteInfo: SiteInfo;
  SiteInput: SiteInput;
  Slot: Slot;
  SlotInput: SlotInput;
  SmsInput: SmsInput;
  String: Scalars['String'];
  User: User;
  ValueSetItem: ValueSetItem;
  ValueSetItemInput: ValueSetItemInput;
  XYZ: Xyz;
};

export type AddressResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = {
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  line?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  postalCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  province?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  use?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppointmentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Appointment'] = ResolversParentTypes['Appointment']> = {
  _id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  actor?: Resolver<Maybe<Array<ResolversTypes['Reference']>>, ParentType, ContextType>;
  appointmentType?: Resolver<Maybe<ResolversTypes['Code']>, ParentType, ContextType>;
  basedOn?: Resolver<Maybe<ResolversTypes['Reference']>, ParentType, ContextType>;
  cancellationReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  end?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  participants?: Resolver<Maybe<Array<ResolversTypes['Participant']>>, ParentType, ContextType>;
  patientInstruction?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reason?: Resolver<Maybe<Array<ResolversTypes['Code']>>, ParentType, ContextType>;
  schedule?: Resolver<Maybe<Array<ResolversTypes['Reference']>>, ParentType, ContextType>;
  serviceCategory?: Resolver<Maybe<Array<ResolversTypes['Code']>>, ParentType, ContextType>;
  serviceType?: Resolver<Maybe<Array<ResolversTypes['Code']>>, ParentType, ContextType>;
  specialty?: Resolver<Maybe<Array<ResolversTypes['Code']>>, ParentType, ContextType>;
  start?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['AppointmentStatus']>, ParentType, ContextType>;
  subject?: Resolver<Maybe<Array<ResolversTypes['Reference']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CareTeamResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CareTeam'] = ResolversParentTypes['CareTeam']> = {
  participants?: Resolver<Array<ResolversTypes['CareTeamParticipant']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CareTeamParticipantResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CareTeamParticipant'] = ResolversParentTypes['CareTeamParticipant']> = {
  delegateOfPractitionerId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  delegationType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expiryDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  note?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organization?: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType>;
  practitioner?: Resolver<Maybe<ResolversTypes['Practitioner']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CodeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Code'] = ResolversParentTypes['Code']> = {
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContactResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Contact'] = ResolversParentTypes['Contact']> = {
  address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
  gender?: Resolver<Maybe<ResolversTypes['GenderInfo']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['Name']>, ParentType, ContextType>;
  purpose?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  telecom?: Resolver<Maybe<Array<ResolversTypes['ContactPoint']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContactPointResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ContactPoint'] = ResolversParentTypes['ContactPoint']> = {
  rank?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  system?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  use?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CppSectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CppSection'] = ResolversParentTypes['CppSection']> = {
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DbFileResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DbFile'] = ResolversParentTypes['DbFile']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  fileName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mimeType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  usedFor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeceasedInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeceasedInfo'] = ResolversParentTypes['DeceasedInfo']> = {
  deceasedBoolean?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  deceasedDateTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = {
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExtensionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Extension'] = ResolversParentTypes['Extension']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GenderResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Gender'] = ResolversParentTypes['Gender']> = {
  context?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GenderInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GenderInfo'] = ResolversParentTypes['GenderInfo']> = {
  identity?: Resolver<Maybe<ResolversTypes['Gender']>, ParentType, ContextType>;
  pronouns?: Resolver<Maybe<ResolversTypes['Pronouns']>, ParentType, ContextType>;
  recordedSexOrGender?: Resolver<Maybe<ResolversTypes['Code']>, ParentType, ContextType>;
  sexForClinicalUse?: Resolver<Maybe<ResolversTypes['Code']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IdentifierResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Identifier'] = ResolversParentTypes['Identifier']> = {
  ext?: Resolver<Maybe<ResolversTypes['Extension']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['Code']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LanguageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Language'] = ResolversParentTypes['Language']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  preferred?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LoginResult'] = ResolversParentTypes['LoginResult']> = {
  jwt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  addAppointment?: Resolver<ResolversTypes['SaveResult'], ParentType, ContextType, RequireFields<MutationAddAppointmentArgs, 'appointment'>>;
  addCredentials?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType, RequireFields<MutationAddCredentialsArgs, 'credentials'>>;
  addPractitioner?: Resolver<ResolversTypes['SaveResult'], ParentType, ContextType, RequireFields<MutationAddPractitionerArgs, 'practitioner'>>;
  addSchedule?: Resolver<ResolversTypes['SaveResult'], ParentType, ContextType, RequireFields<MutationAddScheduleArgs, 'schedule'>>;
  addSite?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType, RequireFields<MutationAddSiteArgs, 'site'>>;
  addSlot?: Resolver<ResolversTypes['SaveResult'], ParentType, ContextType, RequireFields<MutationAddSlotArgs, 'appointment'>>;
  changePassword?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'newPassword' | 'oldPassword' | 'userId'>>;
  deleteAppointment?: Resolver<ResolversTypes['SaveResult'], ParentType, ContextType, RequireFields<MutationDeleteAppointmentArgs, 'id'>>;
  deletePractitioner?: Resolver<ResolversTypes['SaveResult'], ParentType, ContextType, RequireFields<MutationDeletePractitionerArgs, 'id'>>;
  deleteSchedule?: Resolver<ResolversTypes['SaveResult'], ParentType, ContextType, RequireFields<MutationDeleteScheduleArgs, 'id'>>;
  deleteSlot?: Resolver<ResolversTypes['SaveResult'], ParentType, ContextType, RequireFields<MutationDeleteSlotArgs, 'id'>>;
  login?: Resolver<ResolversTypes['LoginResult'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'creds'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  removeCredentials?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType, RequireFields<MutationRemoveCredentialsArgs, 'clientId'>>;
  resetPassword?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'email' | 'newPassword' | 'token'>>;
  saveDocumentReference?: Resolver<ResolversTypes['SaveResult'], ParentType, ContextType, RequireFields<MutationSaveDocumentReferenceArgs, 'resource'>>;
  savePatient?: Resolver<ResolversTypes['SaveResult'], ParentType, ContextType, RequireFields<MutationSavePatientArgs, 'patient'>>;
  sendResetPasswordEmail?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType, RequireFields<MutationSendResetPasswordEmailArgs, 'email'>>;
  sendSms?: Resolver<Maybe<ResolversTypes['Result']>, ParentType, ContextType, RequireFields<MutationSendSmsArgs, 'params'>>;
  setAdmin?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType, RequireFields<MutationSetAdminArgs, 'admin' | 'userId'>>;
  setDisplayName?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType, RequireFields<MutationSetDisplayNameArgs, 'displayName' | 'userId'>>;
  setSiteAccess?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType, RequireFields<MutationSetSiteAccessArgs, 'access' | 'userId'>>;
  signup?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType, RequireFields<MutationSignupArgs, 'user'>>;
  updateAppointment?: Resolver<ResolversTypes['SaveResult'], ParentType, ContextType, RequireFields<MutationUpdateAppointmentArgs, 'appointment'>>;
  updatePractitioner?: Resolver<ResolversTypes['SaveResult'], ParentType, ContextType, RequireFields<MutationUpdatePractitionerArgs, 'practitioner'>>;
  updateSchedule?: Resolver<ResolversTypes['SaveResult'], ParentType, ContextType, RequireFields<MutationUpdateScheduleArgs, 'schedule'>>;
  updateSite?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType, RequireFields<MutationUpdateSiteArgs, 'site'>>;
  updateSlot?: Resolver<ResolversTypes['SaveResult'], ParentType, ContextType, RequireFields<MutationUpdateSlotArgs, 'appointment'>>;
  viewCredential?: Resolver<Maybe<ResolversTypes['SiteCredentials']>, ParentType, ContextType, RequireFields<MutationViewCredentialArgs, 'clientId'>>;
};

export type NameResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Name'] = ResolversParentTypes['Name']> = {
  family?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  given?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  prefix?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  suffix?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  use?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrganizationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = {
  contacts?: Resolver<Maybe<Array<ResolversTypes['Contact']>>, ParentType, ContextType>;
  kind?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ParticipantResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Participant'] = ResolversParentTypes['Participant']> = {
  actor?: Resolver<Maybe<ResolversTypes['Reference']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['ParticipationStatus']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['ParticipantType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PatientResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Patient'] = ResolversParentTypes['Patient']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  address?: Resolver<Maybe<Array<ResolversTypes['Address']>>, ParentType, ContextType>;
  birthDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  careTeam?: Resolver<Maybe<ResolversTypes['CareTeam']>, ParentType, ContextType>;
  contacts?: Resolver<Maybe<Array<ResolversTypes['PatientContact']>>, ParentType, ContextType>;
  deceased?: Resolver<Maybe<ResolversTypes['DeceasedInfo']>, ParentType, ContextType>;
  gender?: Resolver<Maybe<ResolversTypes['GenderInfo']>, ParentType, ContextType>;
  languages?: Resolver<Maybe<Array<ResolversTypes['Language']>>, ParentType, ContextType>;
  maritalStatus?: Resolver<Maybe<ResolversTypes['Code']>, ParentType, ContextType>;
  name?: Resolver<Array<ResolversTypes['Name']>, ParentType, ContextType>;
  photo?: Resolver<Maybe<Array<ResolversTypes['DbFile']>>, ParentType, ContextType>;
  telecom?: Resolver<Array<ResolversTypes['ContactPoint']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PatientChartResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PatientChart'] = ResolversParentTypes['PatientChart']> = {
  cpp?: Resolver<Maybe<Array<ResolversTypes['CppSection']>>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType>;
  patient?: Resolver<Maybe<ResolversTypes['Patient']>, ParentType, ContextType>;
  resources?: Resolver<Maybe<Array<ResolversTypes['PtResource']>>, ParentType, ContextType>;
  siteInfo?: Resolver<Maybe<ResolversTypes['SiteInfo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PatientContactResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PatientContact'] = ResolversParentTypes['PatientContact']> = {
  contact?: Resolver<Maybe<ResolversTypes['Contact']>, ParentType, ContextType>;
  forEmergency?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  poa?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  relationship?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PeriodResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Period'] = ResolversParentTypes['Period']> = {
  end?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  start?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PractitionerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Practitioner'] = ResolversParentTypes['Practitioner']> = {
  billingId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  birthDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  gender?: Resolver<Maybe<ResolversTypes['GenderInfo']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['Name'], ParentType, ContextType>;
  professionalId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  qualifications?: Resolver<Maybe<Array<Maybe<ResolversTypes['Qualification']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfileResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']> = {
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PronounsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Pronouns'] = ResolversParentTypes['Pronouns']> = {
  object?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  possessive?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  self?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subject?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PtResourceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PtResource'] = ResolversParentTypes['PtResource']> = {
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ptId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type QualificationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Qualification'] = ResolversParentTypes['Qualification']> = {
  code?: Resolver<ResolversTypes['Code'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  currentUser?: Resolver<Maybe<ResolversTypes['SessionUser']>, ParentType, ContextType>;
  empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  findByPatientId?: Resolver<Maybe<ResolversTypes['PatientChart']>, ParentType, ContextType, RequireFields<QueryFindByPatientIdArgs, 'ptId'>>;
  findRecentPatients?: Resolver<Array<ResolversTypes['Patient']>, ParentType, ContextType>;
  getAppointment?: Resolver<Maybe<ResolversTypes['Appointment']>, ParentType, ContextType, RequireFields<QueryGetAppointmentArgs, '_id'>>;
  getAppointmentReasons?: Resolver<Maybe<Array<ResolversTypes['Code']>>, ParentType, ContextType>;
  getAppointmentTypes?: Resolver<Maybe<Array<ResolversTypes['Code']>>, ParentType, ContextType>;
  getAppointments?: Resolver<Maybe<Array<ResolversTypes['Appointment']>>, ParentType, ContextType, RequireFields<QueryGetAppointmentsArgs, 'end' | 'scheduleId' | 'start'>>;
  getPractitioner?: Resolver<Maybe<ResolversTypes['Practitioner']>, ParentType, ContextType, RequireFields<QueryGetPractitionerArgs, 'id'>>;
  getPractitionersBySite?: Resolver<Maybe<Array<ResolversTypes['Practitioner']>>, ParentType, ContextType, RequireFields<QueryGetPractitionersBySiteArgs, 'siteId'>>;
  getSchedule?: Resolver<Maybe<ResolversTypes['Schedule']>, ParentType, ContextType, RequireFields<QueryGetScheduleArgs, '_id'>>;
  getScheduleCodes?: Resolver<Maybe<Array<ResolversTypes['Code']>>, ParentType, ContextType>;
  getSchedules?: Resolver<Maybe<Array<Maybe<ResolversTypes['Schedule']>>>, ParentType, ContextType>;
  getSites?: Resolver<Array<ResolversTypes['Site']>, ParentType, ContextType>;
  getSlots?: Resolver<Maybe<Array<ResolversTypes['Slot']>>, ParentType, ContextType, RequireFields<QueryGetSlotsArgs, 'end' | 'scheduleId' | 'start'>>;
  listCredentials?: Resolver<Array<ResolversTypes['SiteCredentialsListItem']>, ParentType, ContextType>;
  user?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType, RequireFields<QueryUserArgs, 'email'>>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
};

export type ReferenceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Reference'] = ResolversParentTypes['Reference']> = {
  display?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  identifiSaveResult?: Resolver<Maybe<ResolversTypes['Identifier']>, ParentType, ContextType>;
  reference?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Result'] = ResolversParentTypes['Result']> = {
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RolesResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Roles'] = ResolversParentTypes['Roles']> = {
  admin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SaveResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SaveResult'] = ResolversParentTypes['SaveResult']> = {
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ScheduleResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Schedule'] = ResolversParentTypes['Schedule']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  active?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  actor?: Resolver<Maybe<Array<ResolversTypes['Reference']>>, ParentType, ContextType>;
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  planningHorizon?: Resolver<Maybe<ResolversTypes['Period']>, ParentType, ContextType>;
  serviceCategory?: Resolver<Maybe<Array<ResolversTypes['Code']>>, ParentType, ContextType>;
  serviceType?: Resolver<Maybe<Array<ResolversTypes['Code']>>, ParentType, ContextType>;
  specialty?: Resolver<Maybe<Array<ResolversTypes['Code']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SessionUserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SessionUser'] = ResolversParentTypes['SessionUser']> = {
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['SessionUserProfile'], ParentType, ContextType>;
  roles?: Resolver<ResolversTypes['SessionUserRoles'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SessionUserProfileResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SessionUserProfile'] = ResolversParentTypes['SessionUserProfile']> = {
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SessionUserRolesResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SessionUserRoles'] = ResolversParentTypes['SessionUserRoles']> = {
  admin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SiteResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Site'] = ResolversParentTypes['Site']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SiteCredentialsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SiteCredentials'] = ResolversParentTypes['SiteCredentials']> = {
  clientId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  clientSecret?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SiteCredentialsListItemResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SiteCredentialsListItem'] = ResolversParentTypes['SiteCredentialsListItem']> = {
  clientId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SiteInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SiteInfo'] = ResolversParentTypes['SiteInfo']> = {
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SlotResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Slot'] = ResolversParentTypes['Slot']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  appointmentType?: Resolver<Maybe<ResolversTypes['Code']>, ParentType, ContextType>;
  comments?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  end?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  scheduleId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  serviceCategory?: Resolver<Maybe<Array<ResolversTypes['Code']>>, ParentType, ContextType>;
  serviceType?: Resolver<Maybe<Array<ResolversTypes['Code']>>, ParentType, ContextType>;
  specialty?: Resolver<Maybe<Array<ResolversTypes['Code']>>, ParentType, ContextType>;
  start?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['SlotStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  roles?: Resolver<ResolversTypes['Roles'], ParentType, ContextType>;
  tagLine?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ValueSetItemResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ValueSetItem'] = ResolversParentTypes['ValueSetItem']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type XyzResolvers<ContextType = Context, ParentType extends ResolversParentTypes['XYZ'] = ResolversParentTypes['XYZ']> = {
  test?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  Address?: AddressResolvers<ContextType>;
  Appointment?: AppointmentResolvers<ContextType>;
  CareTeam?: CareTeamResolvers<ContextType>;
  CareTeamParticipant?: CareTeamParticipantResolvers<ContextType>;
  Code?: CodeResolvers<ContextType>;
  Contact?: ContactResolvers<ContextType>;
  ContactPoint?: ContactPointResolvers<ContextType>;
  CppSection?: CppSectionResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  DbFile?: DbFileResolvers<ContextType>;
  DeceasedInfo?: DeceasedInfoResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  Extension?: ExtensionResolvers<ContextType>;
  Gender?: GenderResolvers<ContextType>;
  GenderInfo?: GenderInfoResolvers<ContextType>;
  Identifier?: IdentifierResolvers<ContextType>;
  Language?: LanguageResolvers<ContextType>;
  LoginResult?: LoginResultResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Name?: NameResolvers<ContextType>;
  Organization?: OrganizationResolvers<ContextType>;
  Participant?: ParticipantResolvers<ContextType>;
  Patient?: PatientResolvers<ContextType>;
  PatientChart?: PatientChartResolvers<ContextType>;
  PatientContact?: PatientContactResolvers<ContextType>;
  Period?: PeriodResolvers<ContextType>;
  Practitioner?: PractitionerResolvers<ContextType>;
  Profile?: ProfileResolvers<ContextType>;
  Pronouns?: PronounsResolvers<ContextType>;
  PtResource?: PtResourceResolvers<ContextType>;
  Qualification?: QualificationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Reference?: ReferenceResolvers<ContextType>;
  Result?: ResultResolvers<ContextType>;
  Roles?: RolesResolvers<ContextType>;
  SaveResult?: SaveResultResolvers<ContextType>;
  Schedule?: ScheduleResolvers<ContextType>;
  SessionUser?: SessionUserResolvers<ContextType>;
  SessionUserProfile?: SessionUserProfileResolvers<ContextType>;
  SessionUserRoles?: SessionUserRolesResolvers<ContextType>;
  Site?: SiteResolvers<ContextType>;
  SiteCredentials?: SiteCredentialsResolvers<ContextType>;
  SiteCredentialsListItem?: SiteCredentialsListItemResolvers<ContextType>;
  SiteInfo?: SiteInfoResolvers<ContextType>;
  Slot?: SlotResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  ValueSetItem?: ValueSetItemResolvers<ContextType>;
  XYZ?: XyzResolvers<ContextType>;
};


export type CodeFragmentFragment = { __typename?: 'Code', value?: string | undefined, text?: string | undefined };

export type NameFragmentFragment = { __typename?: 'Name', family: string, given: Array<string>, prefix?: string | undefined, suffix?: string | undefined, use?: string | undefined };

export type PronounsFragmentFragment = { __typename?: 'Pronouns', subject?: string | undefined, object?: string | undefined, possessive?: string | undefined, self?: string | undefined, text?: string | undefined };

export type PatientBasicFragmentFragment = { __typename?: 'Patient', _id: string, birthDate?: string | undefined, name: Array<{ __typename?: 'Name', family: string, given: Array<string>, prefix?: string | undefined, suffix?: string | undefined, use?: string | undefined }>, telecom: Array<{ __typename?: 'ContactPoint', value: string, use?: string | undefined, rank?: number | undefined }>, gender?: { __typename?: 'GenderInfo', identity?: { __typename?: 'Gender', value: string, context?: string | undefined } | undefined, sexForClinicalUse?: { __typename?: 'Code', value?: string | undefined, text?: string | undefined } | undefined, recordedSexOrGender?: { __typename?: 'Code', value?: string | undefined, text?: string | undefined } | undefined, pronouns?: { __typename?: 'Pronouns', subject?: string | undefined, object?: string | undefined, possessive?: string | undefined, self?: string | undefined, text?: string | undefined } | undefined } | undefined, deceased?: { __typename?: 'DeceasedInfo', deceasedBoolean: boolean } | undefined, maritalStatus?: { __typename?: 'Code', value?: string | undefined, text?: string | undefined } | undefined, address?: Array<{ __typename?: 'Address', use?: string | undefined, type?: string | undefined, line?: Array<string> | undefined, city?: string | undefined, province?: string | undefined, country?: string | undefined, postalCode?: string | undefined }> | undefined, photo?: Array<{ __typename?: 'DbFile', _id: string }> | undefined, careTeam?: { __typename?: 'CareTeam', participants: Array<{ __typename?: 'CareTeamParticipant', role: string, practitioner?: { __typename?: 'Practitioner', professionalId?: string | undefined, name: { __typename?: 'Name', family: string, given: Array<string>, prefix?: string | undefined, suffix?: string | undefined, use?: string | undefined }, qualifications?: Array<{ __typename?: 'Qualification', code: { __typename?: 'Code', value?: string | undefined, text?: string | undefined } } | undefined> | undefined } | undefined }> } | undefined, languages?: Array<{ __typename?: 'Language', code: string, preferred?: boolean | undefined }> | undefined };

export type RecentPatientsQueryVariables = Exact<{ [key: string]: never; }>;


export type RecentPatientsQuery = { __typename?: 'Query', findRecentPatients: Array<{ __typename?: 'Patient', _id: string, birthDate?: string | undefined, name: Array<{ __typename?: 'Name', family: string, given: Array<string>, prefix?: string | undefined, suffix?: string | undefined, use?: string | undefined }>, telecom: Array<{ __typename?: 'ContactPoint', value: string, use?: string | undefined, rank?: number | undefined }>, gender?: { __typename?: 'GenderInfo', identity?: { __typename?: 'Gender', value: string, context?: string | undefined } | undefined, sexForClinicalUse?: { __typename?: 'Code', value?: string | undefined, text?: string | undefined } | undefined, recordedSexOrGender?: { __typename?: 'Code', value?: string | undefined, text?: string | undefined } | undefined, pronouns?: { __typename?: 'Pronouns', subject?: string | undefined, object?: string | undefined, possessive?: string | undefined, self?: string | undefined, text?: string | undefined } | undefined } | undefined, deceased?: { __typename?: 'DeceasedInfo', deceasedBoolean: boolean } | undefined, maritalStatus?: { __typename?: 'Code', value?: string | undefined, text?: string | undefined } | undefined, address?: Array<{ __typename?: 'Address', use?: string | undefined, type?: string | undefined, line?: Array<string> | undefined, city?: string | undefined, province?: string | undefined, country?: string | undefined, postalCode?: string | undefined }> | undefined, photo?: Array<{ __typename?: 'DbFile', _id: string }> | undefined, careTeam?: { __typename?: 'CareTeam', participants: Array<{ __typename?: 'CareTeamParticipant', role: string, practitioner?: { __typename?: 'Practitioner', professionalId?: string | undefined, name: { __typename?: 'Name', family: string, given: Array<string>, prefix?: string | undefined, suffix?: string | undefined, use?: string | undefined }, qualifications?: Array<{ __typename?: 'Qualification', code: { __typename?: 'Code', value?: string | undefined, text?: string | undefined } } | undefined> | undefined } | undefined }> } | undefined, languages?: Array<{ __typename?: 'Language', code: string, preferred?: boolean | undefined }> | undefined }> };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'SessionUser', email?: string | undefined, profile: { __typename?: 'SessionUserProfile', displayName: string }, roles: { __typename?: 'SessionUserRoles', admin: boolean } } | undefined };

export type LoginMutationVariables = Exact<{
  creds: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResult', success: boolean } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type SendSmsMutationVariables = Exact<{
  params: SmsInput;
}>;


export type SendSmsMutation = { __typename?: 'Mutation', sendSms?: { __typename?: 'Result', error?: string | undefined } | undefined };

export const NameFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NameFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Name"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"given"}},{"kind":"Field","name":{"kind":"Name","value":"prefix"}},{"kind":"Field","name":{"kind":"Name","value":"suffix"}},{"kind":"Field","name":{"kind":"Name","value":"use"}}]}}]} as unknown as DocumentNode<NameFragmentFragment, unknown>;
export const PronounsFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PronounsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pronouns"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"object"}},{"kind":"Field","name":{"kind":"Name","value":"possessive"}},{"kind":"Field","name":{"kind":"Name","value":"self"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]} as unknown as DocumentNode<PronounsFragmentFragment, unknown>;
export const CodeFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CodeFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Code"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]} as unknown as DocumentNode<CodeFragmentFragment, unknown>;
export const PatientBasicFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PatientBasicFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Patient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NameFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"telecom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"use"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"context"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sexForClinicalUse"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recordedSexOrGender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pronouns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PronounsFragment"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"deceased"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deceasedBoolean"}}]}},{"kind":"Field","name":{"kind":"Name","value":"maritalStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"use"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"line"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"photo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"careTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"participants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"practitioner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NameFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"professionalId"}},{"kind":"Field","name":{"kind":"Name","value":"qualifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CodeFragment"}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"languages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"preferred"}}]}}]}},...NameFragmentFragmentDoc.definitions,...PronounsFragmentFragmentDoc.definitions,...CodeFragmentFragmentDoc.definitions]} as unknown as DocumentNode<PatientBasicFragmentFragment, unknown>;
export const RecentPatientsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecentPatients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findRecentPatients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PatientBasicFragment"}}]}}]}},...PatientBasicFragmentFragmentDoc.definitions]} as unknown as DocumentNode<RecentPatientsQuery, RecentPatientsQueryVariables>;
export const CurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"admin"}}]}}]}}]}}]} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"creds"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"creds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"creds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const SendSmsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendSms"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"params"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SmsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendSms"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"params"},"value":{"kind":"Variable","name":{"kind":"Name","value":"params"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<SendSmsMutation, SendSmsMutationVariables>;