
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail=(email,name)=>{

    sgMail.send({

        to:email,
        from:'eslamtolba123159@gmail.com',
        subject:'this is my first creation',
        text:`welcome${name},how things going on with the app`
    })

}

const sendGoodByeEmail=(email,name)=>{

    sgMail.send({

        to:email,
        from:'eslamtolba123159@gmail.com',
        subject:'Goode Bye ',
        text:`Good Bye${name},tell  us why you are leaving man ! `
    })

}

module.exports={sendWelcomeEmail,sendGoodByeEmail}