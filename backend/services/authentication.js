import jwt from "jsonwebtoken";

export function createTokenForUser(user) {
  const payload = {
    id: user._id,
    fullname: user.fullname,
    email: user.email,
    role: user.role._id,
    roleName: user.role.name,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}


export function validateToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
