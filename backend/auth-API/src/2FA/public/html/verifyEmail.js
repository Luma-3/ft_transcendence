export default verifyEmail = (trad, url, data) => {
	return `
		<body 
			style="
				text-align: center;
				color: white;
				background-image: url('cid:backgroundImg');
				background-repeat: no-repeat;
				margin: auto;
			"
		>
			<div
				style="
					font-family: 'cid:chillax', sans-serif;
					padding: 40px 30px;
					border-radius: 12px;
					text-shadow: 0 1px 3px rgba(0,0,0,0.6);
				"
				@media screen and (min-width: 500px) {
					width: 100%;
				}
			>
				<div
					style="
						text-align: center;
						margin-bottom: 30px;
					"
				>
					<img
						src="cid:logo"
						alt="Logo"
						style="width: 50%;"
						@media screen and (min-width: 500px) {
							width: 80%;
						}
					>
				</div>

				<p
					style="
						font-size: 16px;
						margin-bottom: 20px;
						text-align: center;
					"
				>
					${trad['verificationIntro']} <strong>${trad['verificationLink']}</strong> :
				</p>

				<div
					style="
						margin: 30px 0;
						text-align: center;
					"
				>
					<a
						href="${url}/verifyEmail?value=${data}"
						style="
							display: inline-block;
							padding: 20px 40px;
							background-color: #22c55e;
							border-radius: 12px;
							font-size: 28px;
							font-weight: bold;
							letter-spacing: 4px;
							color: white;
							box-shadow: 0 4px 6px rgba(0,0,0,0.3);
						"
					>
						${trad['verifyButton']}
					</a>
				</div>

				<p
					style="
						font-size: 14px;
						margin-bottom: 10px;
						text-align: center;
					"
				>
					${trad['linkValidity']}
				</p>

				<p
					style="
						font-size: 14px;
						margin-bottom: 30px;
						text-align: center;
					"
				>
					${trad['ignoreWarning']}
				</p>

				<div
					style="
						background-color: black;
						padding: 4px;
						text-align: center;
						border-radius: 15px;
						max-width: 50%;
						margin: auto;
					"
				>
					<b>
						<p
							style="
								font-size: 14px;
								margin-bottom: 10px;
								text-align: center;
							"
						>
							${trad['automaticMessage']}
							${trad['dontRespond']}
						</p>
					</b>
				</div>

				<div
					style="
						text-align: center;
						max-width: 500px;
						margin: auto;
					"
				>
					<img
						src="cid:duckHappy"
						alt="LogoTranscenduck-Footer"
						style="width: 50%;"
					>
				</div>

				<p
					style="
						font-size: 14px;
						margin: 0;
					"
				>
					${trad['signature']}
				</p>
			</div>
		</body>
	`;
};