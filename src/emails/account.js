
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail=(email: string, name: string): void =>{

    sgMail.send({

        to:email,
        from:'eslamtolba123159@gmail.com',
        subject:'this is my first creation',
        text:`welcome${name},how things going on with the app`
    })

}

const sendGoodByeEmail=(email: string, name: string): void =>{

    sgMail.send({

        to:email,
        from:'eslamtolba123159@gmail.com',
        subject:'Goode Bye ',
        text:`Good Bye${name},tell  us why you are leaving man ! `
    })

}

export { sendWelcomeEmail, sendGoodByeEmail };