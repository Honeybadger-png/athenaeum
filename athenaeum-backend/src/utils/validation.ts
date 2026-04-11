

export const ValidatinAuthgData = (email:string,password:string) => {
    const errors:string[] = []

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/

    if(!email || !emailRegex.test(email)){
        errors.push("Please Provide a valid email address")
    }

    if(password !== undefined) {
        if(password.length < 8){
            errors.push("Please enter a password longer than 8 characters")
        }
        if(!/[A-Z]/.test(password)){
            errors.push("Password must contain at least contain one uppercase letter")
        }
        if(!specialCharRegex.test(password)){
            errors.push("Password must contain at least one special character (e.g., !@#$%) . " )
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}