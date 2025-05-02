from django.core.signing import TimestampSigner, BadSignature, SignatureExpired

signer = TimestampSigner()

def generate_email_token(email):
    return signer.sign(email)

def verify_email_token(token, max_age=3600):  # 3600 seconds = 1 hour
    try:
        email = signer.unsign(token, max_age=max_age)
        return email
    except SignatureExpired:
        return "expired"
    except BadSignature:
        return "invalid"
