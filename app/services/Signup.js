const rootPrefix = '../..',
  CommonValidators = require(rootPrefix + '/helpers/validators'),
  basicHelper = require(rootPrefix + '/helpers/basic'),
  UserModel = require(rootPrefix + '/models/User');

const crypto = require('crypto');

/**
 * Signup
 *
 * @Class
 */
class Signup{
  /**
   *
   *
   * @param params
   * @constructor
   */
  constructor(params){
    const oThis = this;
    
    oThis.password = params.password;
    oThis.emailId = params.email_id;
    oThis.mobileNumber = params.mobile_number;
  }
  
  /**
   * Perform
   *
   * @returns {Promise<void>}
   */
  async perform(){
    const oThis = this;
    
    await oThis._validateAndSanitize();
    
    oThis.encryptionSalt = await basicHelper._generateRandomString(10);
    
    oThis.passwordHash = await oThis._generatePasswordHash(oThis.password, oThis.encryptionSalt);
    
    await oThis._insertInUsers();
    
    await oThis._prepareCookieValue();
    
    return {
      success: true,
      cookieValue: 'qwertyuiop'
    }
  }
  
  /**
   * Validate and Sanitize.
   *
   * @returns {Promise<void>}
   * @private
   */
  async _validateAndSanitize() {
    const oThis = this;
    
    if(!CommonValidators.validateEmailId(oThis.emailId)){
      return {
        success: false,
        code: 422,
        error: 'Invalid Email Id'
      }
    }
  
    if(!CommonValidators.validatePasswordString(oThis.password)){
      return {
        success: false,
        code: 422,
        error: 'Invalid Password. Password should contain minimum 4 characters with at least one letter and one number.'
      }
    }
    
    if(!CommonValidators.validateMobileNumber(oThis.mobileNumber)){
      return {
        success: false,
        code: 422,
        error: 'Invalid Mobile Number'
      }
    }
  }
  
  /**
   * Generate password hash.
   *
   * @param password
   * @param salt
   * @returns {Promise<string>}
   * @private
   */
  async _generatePasswordHash(password, salt) {
    const oThis = this;
  
    let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    let value = hash.digest('hex');
    return value;
  }
  
  /**
   * Insert in users table.
   *
   * @returns {Promise<void>}
   * @private
   */
  async _insertInUsers() {
    const oThis = this;
  
    await UserModel.create({
      email_id: oThis.emailId,
      password: oThis.passwordHash,
      mobile_number: oThis.mobileNumber,
      encryption_salt: oThis.encryptionSalt
    });
  }
  
  async _prepareCookieValue() {
    const oThis = this;
  }
  
}

module.exports = Signup;