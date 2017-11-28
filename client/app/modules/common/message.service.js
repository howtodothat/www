'use strict';

function MessageService() {
  // we could do additional work here too
  var message = {
    Us: {
      'notJSON': 'Internal Error.',
      'user.profile-update.successful': 'Edit Profile successfully.',
      'user.login.inactived': 'This user has been inactived.',
      'user.login.rejected': 'This user has been rejected.',
      'contact.successful': 'contact successful.',
      'signup.certificate_file.isrequired': 'Attach Certification is required.',
      'signup.esignature.isrequired': 'eSignature is required.',
      'M-01': 'This action will clear all your inputted data. Are you sure?',
      'M-02': 'Update has been saved successfully.',
      'M-03': 'This email address has already been taken.',
      'M-04': 'Internet Error',
      'M-05': 'Request reset password successfully! Please check your email. Thank you!',
      'M-08': 'Reset password successfully! Thank you!',
      'M-06': 'Your account has been registered successfully! Thank you!',
      'M-07': 'Token invalid!',
      'login.incorrect': 'Wrong username or password. Please check!',
      'hover-explain-cancel': 'Remove and Close this request service',
      'hover-explain-reject': 'Send back to Requester for update',
      'hover-explain-post': 'Assign banknotes number and Print the certificates',
      'hover-explain-deliver': 'Pick up at the office or Send post mail - Request Service completed',
      'hover-explain-resubmit': 'Submit back to Mortician System',
      'hover-explain-clone': 'Clone this request',
      'hover-explain-duplicate': 'Duplicate this request',
      'request.required.add-burial-permit': 'Please add Burial Permit',
      'request.required.veteran_once': 'Veteran copy allowed ONLY once',
      'request.required.veteran_same_death': "The number of Death Certificate should be greater than 1 if Veteran's copy is checked!",
      'certificate.refund.payment_not_found': "The payment was not found",
      'certificate.refund.cannot_be_issued': "The refund cannot be issued",
      'certificate.refund.authentication_failed': "Authentication failed",
      'message.compose.success': "Your message was sent",
      'message.cancel.success': "Your message has been saved to Cancel Box.",
      'certificates.verify.successful': "Verify successfully.",
      'certificates.un-verify.successful': "Unverify successfully.",
      'select.verified.certificate.only': "Please select verified certificate only.",
      'select.certificate.non-verified.only': "Please select non-verified certificate only.",
      'confirm.save-message-to-cancel-box': "Do you want to save change to Cancel Box?",
      'certificate.change_status.banknote_not_enought': "Banknotes is not enough.",
      'certificate.change_status.banknote_no_invalid': "Banknote ID is invalid.",
      'certificate.create.verify_sign_fail': 'Signature is invalid.',
      'banknote.avoid.banknote_series_invalid': 'Banknote is invalid.',
      'banknote.avoid.banknote_not_enought': 'Banknotes is not enough.',
      'request.required.need-pay-burial-permit': 'You have registered :num Burial Permits from State. Please input them into this request.',
      'post-certificate.not-enough-paid-burial': 'Warning! This request has not paid for :num Burial Permits before.',
      'post-certificate.overwrite-amend-file': 'Do you want to overwrite Amend File?',
      'certificate.void-banknotes.success': 'Banknote (:void) is void and replaced by (:use) successfully',
      'post-certificate.amend-not-same-death-file': 'The state file number of Death Certificate is not matching Amend File',
      'download.file-not-found': 'File not found',
      'claim.save.success': 'Claim has been saved successfully.',
      'claim.submit.success': 'Claim has been submitted successfully.',
      'claim.editted.success': 'Edited successfully',
      'claim.save.invaildInput': 'Please enter data.',
      'claim.save.validate.atLeastOneRowService': 'Please enter at least one row service.',
      'claim.esign.reponse.error': 'Error: cannot make e-sign.',
      'claim.update.success': 'Claim has been saved successfully.',
      'claim.update.status.ask': 'Do you want to :type this claim?',
      'claim.update.status.success': 'The Claim [:name] has been :type',
      'claim.state.change.confirm': "You haven't finished your claim yet. Do you want to leave without finishing?",
      'payment.edit.status.missing-claim': 'There is no claim in this batch. Please add claim!',
      'eob.save.success': 'EOB code [:code] has been added successfully.',
      'eob.edit.success': 'EOB code [:code] has been edited successfully.',
      'eob.delete.confirm': 'Do you want to remove EOB code [:code]?',
      'eob.in-active.success': 'Change status successfully',
      'eob.active.success': 'Change status successfully',
      'eob.in-active.selected-empty': 'Please select at least one row',
      'cpt.save.success': 'CPT code [:code] has been added successfully.',
      'cpt.edit.success': 'CPT code [:code] has been edited successfully.',
      'cpt.delete.confirm': 'Do you want to remove CPT code [:code]?',
      'cpt.import.success': '[:name] has been imported successfully.',
      'cpt.edit.not_found': 'This item has removed.',
      'medicare.save.success': 'Added successfully.',
      'medicare.edit.success': 'Edited successfully.',
      'medicare.delete.confirm': 'Do you want to remove this Medicare?',
      'medicare.import.success': 'Medicare has been imported successfully.',
      'medicare.edit.not_found': 'This item has removed.',
      'funding-source.remove.success': 'Removed [:name] successfully.',
      'funding-source.remove.ask': 'Do you want to remove FUNDING SOURCE ID [:name]?',
      'funding-source.add.success': 'FUNDING SOURCE ID [:name] has been added successfully.',
      'funding-source.edit.success': 'FUNDING SOURCE ID [:name] has been edited successfully.',
      'icd.save.success': 'ICD code [:code] has been added successfully.',
      'icd.edit.success': 'ICD code [:code] has been edited successfully.',
      'icd.delete.confirm': 'Do you want to remove ICD code [:code]?',
      'common.import.success': '[:name] has been imported successfully.',
      'validation-rule.inactive.ask': 'Do you want to inactive in Rule ID [:name]?',
      'validation-rule.active.ask': 'Do you want to active in Rule ID [:name]?',
      'validation-rule.active.success': 'Rule ID [:name] active successfully',
      'validation-rule.inactive.success': 'Rule ID [:name] inactive successfully',
      'pos.save.success': 'POS code [:code] has been added successfully.',
      'pos.edit.success': 'POS code [:code] has been edited successfully.',
      'pos.delete.confirm': 'Do you want to remove POS code [:code]?',
      'paid-rate.save.success': 'Added successfully.',
      'paid-rate.edit.success': 'Edited successfully.',
      'paid-rate.delete.confirm': 'Do you want to remove it?',
      'paid-rate.import.success': '[:name] has been imported successfully.',
      'paid-rate.update-config.success': 'Edited successfully.',
      'system-default.edit.success': 'Edited successfully.',
      'system-default.save.success': 'Added successfully.',
      'system-default.delete.confirm': 'Do you want to remove this item?',
      'vendor.renew-reject.success': 'Reject successfully',
      'vendor.approve.success': 'Approve successfully',
      'vendor.renew.success': 'Upload certificate successfully'
    }
  };
  var paymentMethod = ['Check', 'Cash', 'Credit Card'];
  var paymentMethodListing = [
    { id: 0, name: 'Check' },
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Credit Card' }
  ];
  return {
    getContent: _getContent,
    getNamePaymentMethod: _getNamePaymentMethod,
    getFailMessage: _getFailMessage,
    getListPaymentMethod: _getListPaymentMethod
  };
  function _getListPaymentMethod() {
    return paymentMethodListing;
  }
  function _getContent(id, $arr) {
    var text = id;
    if (!_.isUndefined($arr)) {
      if (message.Us[id]) {
        text = message.Us[id];
        _.each($arr, function (v, k) {
          text = text.replace(':' + k, v);
        });
      }
    } else {
      if (message.Us[id]) {
        text = message.Us[id];
      }
    }
    return text;
  }
  function _getNamePaymentMethod(id) {
    return paymentMethod[id];
  }
  function _getFailMessage(message) {
    var failAuthorMsg = '';
    if (_.isObject(message)) {
      _.each(message, function (num, key) {
        failAuthorMsg = num[0];
      });
    } else {
      failAuthorMsg = message;
    }
    return _getContent(failAuthorMsg);
  }
}

module.exports = MessageService;