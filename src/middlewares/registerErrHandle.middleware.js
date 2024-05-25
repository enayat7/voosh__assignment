import  { z, ZodError } from "zod"

const userSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(3),
});


const registrationValidate = (req,res,next) => {

    const result = userSchema.safeParse({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    if(result.success){
        next()
    }
    else{
        return res.status(400).send({ error: 'Validation error', details: result.error.errors });
    }
};
export default registrationValidate;
