# Dashboard Bootstrap App

Contents:

1) [Build setup](#1-build-setup)
2) [Routes & navigation](#2-routes--navigation)
3) [Authentication & auth middleware](#3-authentication--auth-middleware)
4) [Styling & UI](#4-styling--ui)
5) [Serverless and AWS integration](#5-serverless-and-aws-integration)

## 1) Build setup


```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).


## 2) Routes & navigation

Nuxt.js [file system routing](https://nuxtjs.org/docs/2.x/features/file-system-routing) handles router generation fom `~/pages` folder and requires no additional configuration.  
For convenience of navigation between pages: prevent typos, keep up-to-date routes map and handling page titles & meta, it is encouraged to use application router helper located in `~/plugins/app-routes`.  
Every new page route should be described in corresponding plugin file and used later on for `nuxt-link` and programmatic navigation.  

Route definition example in `~/plugins/app-routes`:
```js
dashboard: {
  route: {
    name: 'index'
  },
  title: 'Home'
}
```

Example usage via `nuxt-link`:

```vue
<nuxt-link :to="$routes.dashboard.route">
  Home
</nuxt-link>
```

Example usage via programmatic navigation:

```vue
methods: {
  navigateToDashboard () {
    this.$router.push(this.$routes.dashboard.route)
  }
}
``` 

## 3) Authentication & auth middleware

##### Tools

Amazon Cognito is handling every step of user authentication. [AWS Amplify Authentication](https://docs.amplify.aws/lib/auth/getting-started/q/platform/js) SDK and Vue.js UI components provide storage, sign-up, sign-in, access recovery and authorization check in the application.  

##### Auth client and API

AWS Amplify client is configured in `~/plugins/aws-amplify-setup` to ensure that all Amplify clients (Auth, Storage, etc) are configured before any navigation occurs. In such way we are confident that every next access to Amplify methods are authenticated and up-to-date, including middleware authentication check.    


##### Middleware

Application pages are protected from unauthenticated users with authentication middleware (`~/middleware/authentication`). Considering vast majority of application pages make authenticated requests to the API, it is assumed that every page is protected unless the page has `NOT_AUTHNETICATED` meta defined in page component.  
Therefore, there is no need to specify page authentication meta, unless it is a public page.   
Example: 

```js
export default {
  ..., // page component options 
  meta: {
    auth: [
      authStatus.NOT_AUTHENTICATED
    ]
  }
}
```

See `~/pages/auth.vue` for example usage.  

## 4) Styling & UI

[Vuetify](https://vuetifyjs.com/) is a primary solution for application styling and interactive components. 

In order to provide consistent design across application pages additional wrapper components are available. Each component has specific purpose and should be utilized accordingly:

#### `AColumn` layout helper

Location: `~/components/common/AColumn`  

Custom column component is a wrapper of `VCol` grid system component with vertical padding reset in order to provide consistent space for page wrapping `VRow` with nested `VCard`. Make sure to use `AColumn` as part of page layout to give each content card even paddings of 16px on every side.

#### `PageTitle` layout helper

Location: `~/components/common/PageTitle`

Common h1 page title component makes it easy to keep page title styles consistent and highlight page title with blinking animation if anchored link is entered (with help of `TitleAnchored` component).

#### `ProgressContent` reusable spinner

Location: `~/components/general/ProgressContent` 

Reusable page content loader that helps with consistent spaces and loading text across all pages with asynchronous data.

### Custom styling

Vuetify doesn't cover every aspect of application design. If new styling requirement cannot be achieved by Vuetify configuration via component's props, CSS styles or [SASS variables](https://vuetifyjs.com/en/features/sass-variables/) (`~/assets/styles/_config.scss`), then standard SCSS should be used following [BEM](https://en.bem.info/methodology/quick-start/) methodology as much as possible.  


## 5) Serverless and AWS integration

Application is using serverless architecture for storing and managing user data. All the services are integrated with [AWS Javascript SDK for browser](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-browser.html) except for user authentication, which is managed by [AWS Amplify Authentication](https://docs.amplify.aws/lib/auth/getting-started/q/platform/js) as described in the section above. This means that we inherit Cognito credentials to authorize AWS SDK services.  
[AWSClient.js](/services/aws/AWSClient.js) is the main AWS services configuration module and serves as a singleton factory of all the services being used in the application.  

Current list of AWS services:

- **DynamoDB**  
  Primary source of application's data storage. DynamoDB is used to query and update user profile, subscription pricing details, payment method and invoices.
  
- **Lambda**  
  Mainly used as a bridge with third-party services (i.e. Stripe) - check coupon, customer subsciption status.
  
- **S3**  
  Primary file storage for customers. Used to store customer avatar uploads and customer support tickets in corresponding buckets. 
  
- **CognitoSync**  
  Storage of account specific UI preferences: preferred color theme, minimized sidebar, etc.  
  
Every new services should be declared in [AWSClient.js](/services/aws/AWSClient.js) following existing services examples. If new services requires an additional payload formatting layer, it should be put in a separate module inside `~/services/aws` to prevent clogging of main AWS client configuration module.
