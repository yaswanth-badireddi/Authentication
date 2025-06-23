import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemp.js"
import { mailtrapClient,sender } from "./mailtrap.config.js"

export const sendverificationEmail=async(email,verifivationToken)=>{
    const recipient=[{email}]

    try{
        const response= await mailtrapClient.send({
            from:sender,
            to: recipient,
            subject:"verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verifivationToken),
            category: "Email verification"
        })
        console.log("Email sent successfully",response)
    }
    catch(error){
        console.error(`Error sending verification email`,error);


        throw new Error(`Error sending verification email:${error}`);
    }
};

export const sendWelcomeEmail=async(email,name)=>{
    const recipient=[{email}]

    try{
        const response= await mailtrapClient.send({
            from:sender,
            to: recipient,
            template_uuid:"9a2296d1-4c71-4c9e-a4c6-0d7986f78d7b",
             template_variables: {
                "company_info_name": "Test_Company_info_name",
                "name": "Test_Name"
             },
           
        });
        console.log("Welcome Email sent successfully",response)
    }
    catch(error){
        console.error(`Error sending verification email`,error);


        throw new Error(`Error sending verification email:${error}`);
    }

}

export const sendPasswordResetEmail=async(email,resetURL)=>{
    const recipient=[{email}]

    try{
        const response= await mailtrapClient.send({
            from:sender,
            to: recipient,
            subject:"reset your password",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
            category: "password reset",
        });
        console.log("Password reset email sent",response)
    }
    catch(error){
        console.error(`Error sending resetEmail email`,error);

        throw new Error(`Error sending resetEmail email:${error}`);
    }

}


export const sendResetSuccessEmail=async(email)=>{
    const recipient=[{email}]

    try{
        const response= await mailtrapClient.send({
            from:sender,
            to: recipient,
            subject:"reset password successful",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "password reset",
        });
        console.log("password reset email successful",response)
    }
    catch(error){
        console.error(`Error sending password reset success`,error);

        throw new Error(`Error sending password reset success${error}`);
    }

}