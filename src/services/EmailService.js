const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
dotenv.config()
var inlineBase64 = require('nodemailer-plugin-inline-base64');

const sendEmailCreateOrder = async (email, orderItems) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ACCOUNT, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
  });
  console.log('Sending email with account:', process.env.MAIL_ACCOUNT)
  console.log('Password length:', process.env.MAIL_PASSWORD ? process.env.MAIL_PASSWORD.length : 0)
  transporter.use('compile', inlineBase64({ cidPrefix: 'somePrefix_' }));

  let listItem = '';
  orderItems.forEach((order) => {
    listItem += `<div>
    <div>
      Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> và giá là: <b>${order.price} VND</b></div>
      <div>Bên dưới là hình ảnh của sản phẩm</div>
      <img src="${order.image}" alt="san pham" style="width: 200px; height: auto; object-fit: cover;" />
    </div>`
  })

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT, // sender address
    to: email, // list of receivers
    subject: "Bạn đã đặt hàng tại shop hocdehocmai", // Subject line
    text: "Hello world?", // plain text body
    html: `<div><b>Bạn đã đặt hàng thành công tại shop hocdehocmai</b></div> ${listItem}`,
  });
}

module.exports = {
  sendEmailCreateOrder
}