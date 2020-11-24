import { sync } from 'vuex-router-sync'

export default ({ store, app: { router } }) => {
  sync(store, router)
}
