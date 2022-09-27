import config from "./smart-server-config";

/**
 * This class tries to make it easier and cleaner to work with scopes (mostly by
 * using the two major methods - "has" and "matches").
 */
class ScopeSet {
  _scopesString: string;
  _scopes: string[];
  constructor(str = "") {
    this._scopesString = String(str).trim();
    this._scopes = this._scopesString.split(/\s+/).filter(Boolean);
  }

  has(scope: string) {
    return this._scopes.indexOf(scope) > -1;
  }

  matches(scopeRegExp: string) {
    return this._scopesString.search(scopeRegExp) > -1;
  }

  add(scope: string) {
    if (this.has(scope)) {
      return false;
    }

    this._scopes.push(scope);
    this._scopesString = this._scopes.join(" ");
    return true;
  }

  remove(scope: string) {
    const index = this._scopes.indexOf(scope);
    if (index < 0) {
      return false;
    }
    this._scopes.splice(index, 1);
    this._scopesString = this._scopes.join(" ");
    return true;
  }

  toString() {
    return this._scopesString;
  }

  toJSON() {
    return this._scopes;
  }

  static getInvalidSystemScopes(scopes: string | string[]) {
    scopes = String(scopes || "").trim();

    if (!scopes) {
      return config.errors.missing_scope;
    }

    scopes = scopes.split(/\s+/);

    return (
      scopes.find(
        (s) => !/^system\/(\*|[A-Z][a-zA-Z]+)(\.(read|write|\*))?$/.test(s)
      ) || ""
    );
  }
}

export default ScopeSet;
