import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "transcenduck@gmail.com",
		pass: "lmap lnva sedv tmmt"
	}
})