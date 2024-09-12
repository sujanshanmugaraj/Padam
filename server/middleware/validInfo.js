const validInfo = async (req, res, next) => {
    const { email, name, password} = req.body

    const validMail = (useremail) => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(useremail)
    }

    if(req.path === "/addUser"){
        if (![email, name, password].every(Boolean)) {
            return res.status(403).json("Missing Credentials");
          } else if (!validMail(email)) {
            return res.status(403).json("Invalid Email");
          }
    }
    else if(req.path === "/loginUser"){
        if (![email, password].every(Boolean)) {
            return res.status(403).json("Missing Credentials");
          } else if (!validMail(email)) {
            return res.status(403).json("Invalid Email");
          }
    }

    next();
}

module.exports = { validInfo }