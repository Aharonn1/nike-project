import { ValidationError } from "./client-errors";
import Joi from "joi";

class CredentialsModel {

    email: string
    password: string;

    constructor(credentials: CredentialsModel) {

        this.email = credentials.email
        this.password = credentials.password;
    }

    private static validationSchema = Joi.object({
        email: Joi.string().required().min(10).max(50),
        password: Joi.string().required().min(6).max(256)
    })

    validate(): void {
        const result = CredentialsModel.validationSchema.validate(this);
        if (result.error) throw new ValidationError(result.error.message)
    }
    // TODO: add validation

}

export default CredentialsModel;