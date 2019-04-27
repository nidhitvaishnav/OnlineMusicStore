$(document).ready(function() {
    //First Name Span
    $("#fname").after('<span id="fNameSpan"></span>');
    $('#fNameSpan').hide();

    // Last Name Span
    $("#lname").after('<span id="lNameSpan"></span>');
    $('#lNameSpan').hide();

    // Password Span
    $("#password").after('<span id="passwordSpan"></span>');
    $('#passwordSpan').hide();

    // Email Span
    $("#email").after('<span id="emailSpan"></span>');
    $('#emailSpan').hide();

    // Password Repeat Span
    $("#passwordRepeat").after('<span id="passwordRepeatSpan"></span>');
    $('#passwordRepeatSpan').hide();

    // Validation

    // First Name
    $('#fname').focus(function() {
        $('#fNameSpan').empty();
        $('#fNameSpan').removeClass();
        $('#fNameSpan').show();
        $('#fNameSpan').append('First Name can contain only alphabets');
        $('#fNameSpan').addClass('info');
    });

    $('#fname').blur(function() {
        if ($('#fname').val() == '') {
            $('#fNameSpan').hide();
        } else {
            var fNameRegex = new RegExp('^[a-zA-Z]+$')
            if (!fNameRegex.test($('#fName').val())) {
                $('#fNameSpan').empty();
                $('#fNameSpan').removeClass();
                $('#fNameSpan').show();
                $('#fNameSpan').append('Email should be of the format abc@xyz.com');
                $('#fNameSpan').addClass('error');
            } else {
                $('#fNameSpan').empty();
                $('#fNameSpan').removeClass();
                $('#fNameSpan').show();
                $('#fNameSpan').append('No Errors');
                $('#fNameSpan').addClass('ok');
            }
        }
    });

    // Last Name
    $('#lname').focus(function() {
        $('#lNameSpan').empty();
        $('#lNameSpan').removeClass();
        $('#lNameSpan').show();
        $('#lNameSpan').append('Last Name can contain only alphabets');
        $('#lNameSpan').addClass('info');
    });

    $('#lname').blur(function() {
        if ($('#lname').val() == '') {
            $('#lNameSpan').hide();
        } else {
            var lNameRegex = new RegExp('^[a-zA-Z]+$')
            if (!lNameRegex.test($('#lName').val())) {
                $('#lNameSpan').empty();
                $('#lNameSpan').removeClass();
                $('#lNameSpan').show();
                $('#lNameSpan').append('Email should be of the format abc@xyz.com');
                $('#lNameSpan').addClass('error');
            } else {
                $('#lNameSpan').empty();
                $('#lNameSpan').removeClass();
                $('#lNameSpan').show();
                $('#lNameSpan').append('No Errors');
                $('#lNameSpan').addClass('ok');
            }
        }
    });


    // Email
    $('#email').focus(function() {
        $('#emailSpan').empty();
        $('#emailSpan').removeClass();
        $('#emailSpan').show();
        $('#emailSpan').append('Email should be of the format abc@xyz.com');
        $('#emailSpan').addClass('info');
    });

    $('#email').blur(function() {
        if ($('#email').val() == '') {
            $('#emailSpan').hide();
        } else {
            var emailRegex = new RegExp('.*@.*$')
            if (!emailRegex.test($('#email').val())) {
                $('#emailSpan').empty();
                $('#emailSpan').removeClass();
                $('#emailSpan').show();
                $('#emailSpan').append('Email should be of the format abc@xyz.com');
                $('#emailSpan').addClass('error');
            } else {
                $('#emailSpan').empty();
                $('#emailSpan').removeClass();
                $('#emailSpan').show();
                $('#emailSpan').append('No Errors');
                $('#emailSpan').addClass('ok');
            }
        }

    });

    // Password
    $('#password').focus(function() {
        $('#passwordSpan').empty();
        $('#passwordSpan').removeClass();
        $('#passwordSpan').show();
        $('#passwordSpan').append('Password should be atleast 6 characters long');
        $('#passwordSpan').addClass('info');
    });

    $('#password').blur(function() {
        if ($('#password').val() == '') {
            $('#passwordSpan').hide();
        } else {
            var passwordRegex = new RegExp('^.{6,}$')
            if (!passwordRegex.test($('#password').val())) {
                $('#passwordSpan').empty()
                $('#passwordSpan').removeClass()
                $('#passwordSpan').show()
                $('#passwordSpan').append('Password should be at least 6 characters long')
                $('#passwordSpan').addClass('error')
            } else {
                $('#passwordSpan').empty()
                $('#passwordSpan').removeClass()
                $('#passwordSpan').show()
                $('#passwordSpan').append('No Errors')
                $('#passwordSpan').addClass('ok')
            }
        }
    });


    // Password Repeat
    $('#passwordRepeat').focus(function() {
        $('#passwordRepeatSpan').empty();
        $('#passwordpasswordRepeatSpanSpan').removeClass();
        $('#passwordRepeatSpan').show();
        $('#passwordRepeatSpan').append('Passwords Should Match');
        $('#passwordRepeatSpan').addClass('info');
    });

    $('#passwordRepeat').blur(function() {
        if ($('#passwordRepeat').val() == '') {
            $('#passwordRepeatSpan').hide();
        } else {
            var password = $('#password').val();
            var passwordRepeat = $('#passwordRepeat').val();
            if (password != passwordRepeat) {
                $('#passwordRepeatSpan').empty()
                $('#passwordRepeatSpan').removeClass()
                $('#passwordRepeatSpan').show()
                $('#passwordpasswordRepeatSpanSpan').append('Passwords Should Match')
                $('#passwordRepeatSpan').addClass('error')
            } else {
                $('#passwordRepeatSpan').empty()
                $('#passwordRepeatSpan').removeClass()
                $('#passwordRepeatSpan').show()
                $('#passwordRepeatSpan').append('No Errors')
                $('#passwordRepeatSpan').addClass('ok')
            }
        }
    });
});
