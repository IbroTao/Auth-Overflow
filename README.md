THIS WEB APPLICATION DEALS WITH MANY FEATURES. AMONG THIS ARE:

- User Authentication: {
  Login,
  Logout,
  Register
  }

- User Reset: {
  Send Password Reset Token to the user via his/her email,
  Reset Password,
  Email Verification during Registration
  };

- Product Purchase: {
  Only admin can add product to the dashboard.
  User can add those products to cart.
  Admin can update product and delete product
  }

- Ordering: {
  User can order product directly online.
  Only admin can change order status
  }

- Middlewares: {
  Users must be authenticated before they can perform any operation
  There are only two roles: admin and user,
  There must be token present in cookies for user authentication and reset
  }

- Error Handlers: {
  Different errors can likely occur while using the web app. Therefore, there are different handlers to solve these errors
  }
