# dashboard-bootstrap-app

## Build Setup

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


## Routes & navigation

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

## Authentication & auth middleware

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

## Styling & UI

In progress...
