// Login Seller : /api/seller/login
import jwt from 'jsonwebtoken'

export const sellerlogin = async(req,res)=>{
    try {
        const {email , password } = req.body;
        if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){
            const token = jwt.sign({email},process.env.JWT_SECRET , {expiresIn : '7d'})

            res.cookie('sellerToken',token,{
            httpOnly : true, //PREVENT JAVASCRIPT TO ACCESS COOKIE
            secure : true,  //USE SECURE COOKIE IN PRODUCTION
            sameSite : "none" ,//CSRF PROTECTION
            domain: ".onrender.com",     // 🔥 REQUIRED
            path: "/",
            maxAge : 7*24*60*60*1000,
            });
            return res.json({success: true ,message : "Logged In"})
        } 
        else{
            return res.json({success: false ,message : "Invalid Credentials"})
        }
    } catch (error) {
        console.log(error.message);
        
        return res.json({success: false ,message : error.message})
    }
}

// Seller isAuth : /api/seller/is-auth

export const isSellerAuth = async (req, res) => {
  const { sellerToken } = req.cookies;

  if (!sellerToken) return res.json({ success: false });

  try {
    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

    if (decoded.email === process.env.SELLER_EMAIL) {
      return res.json({ success: true });
    }

    return res.json({ success: false });
  } catch {
    return res.json({ success: false });
  }
};


export const sellerLogout = async(req,res)=>{
    try {
        res.clearCookie('sellerToken',{
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain: ".onrender.com",
            path: "/",
        });
        return res.json({success : true , message : "Logged Out"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false , message: error.message});
    }
}