import { useUserStore } from '~/store/user';
import { useNotificationsStore } from '~/store/notifications';
function trimId(text) {
  const hyphenIndex = text.indexOf('-');
  if (hyphenIndex !== -1) {
    return (
      text.substring(0, hyphenIndex).charAt(0).toUpperCase() +
      text.substring(0, hyphenIndex).slice(1)
    );
  } else {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}

export function useNotificationTrigger() {
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();

  document.title = document.title = `Talentum ${
    route.name !== 'index' ? trimId(route.name) : 'Dashboard'
  }`;
  router.beforeEach((to, from, next) => {
    if (userStore.isAuthenticated) {
      document.title = `Talentum ${to.name !== 'index' ? trimId(to.name) : 'Dashboard'}`;
      useNotificationsStore().getNotificationsAction();
      next();
    }
  });
}
