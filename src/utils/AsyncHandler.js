const asyncHandler = (requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((err)=>next(err))
    }
}


export {asyncHandler}  //It is just a different way to export the function doing the same thing as "export default asyncHandler;"



//This is a higher oreder function, which means function that take function as a parameter

// const asyncHandler = (func) => {async(req,res,next)=>{
//     try{
//         await func(req,res,next)
//     }catch(error){
//         res.status(error.code||500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }}

// export default asyncHandler