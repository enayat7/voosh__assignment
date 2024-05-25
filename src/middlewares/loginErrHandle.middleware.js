import  { z, ZodError } from "zod"

const userEmailSchema = z.object({
  email: z.string().email(),
});

const isEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };


const loginValidate = (req,res,next) => {
    if(isEmail(req.body.email)){
        const result = userEmailSchema.safeParse({
            email : req.body.email ,
        });
        if(result.success){
            next();
        }
        else{
            return res.status(400).send({ error: 'Validation error', details: result.error.errors });
        }
    }
    else es.status(400).send({ error: 'Validation error'});
};

export default loginValidate
