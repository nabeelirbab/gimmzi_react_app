import {CommonActions, createNavigationContainerRef} from '@react-navigation/native';
import {StackActions} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function replace(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(name, params));
  }
}

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

export function reset(index, name) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: index,
      routes: [{name: name}],
    });
  }
}

export function canGoBack(num) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.pop(num));
  }
}

export function navigateToTabScreen(screenName, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate('TabNavigation', {
      screen: screenName,
      params: params,
    });
  }
}

export function navigateToCommunityScreen(screenName, params) {
  if (navigationRef.current) {
    navigationRef.current.navigate('TabNavigation', {
      screen: 'CommunityStack',
      params: {
        screen: screenName,
        params: params,
      },
    });
  }
}

export function navigateToUniverseScreen(screenName, params) {
  if (navigationRef.current) {
    navigationRef.current.navigate('TabNavigation', {
      screen: 'UniverseStack',
      params: {
        screen: screenName,
        params: params,
      },
    });
  }
}

export function navigateToCategoriesScreen(screenName, params) {
  if (navigationRef.current) {
    navigationRef.current.navigate('TabNavigation', {
      screen: 'CategoriesStack',
      params: {
        screen: screenName,
        params: params,
      },
    });
  }
}

export function navigateToFavouriteScreen(screenName, params) {
  if (navigationRef.current) {
    navigationRef.current.navigate('TabNavigation', {
      screen: 'FavouriteStack',
      params: {
        screen: screenName,
        params: params,
      },
    });
  }
}

export function navigateToMyHubScreen(screenName, params) {
  if (navigationRef.current) {
    navigationRef.current.navigate('TabNavigation', {
      screen: 'MyHubStack',
      params: {
        screen: screenName,
        params: params,
      },
    });
  }
}

export function resetToNavigateMyHubScreen(screenName, params) {
  if (navigationRef.current) {
    navigationRef.current.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MyHubStack' }],
      })
    );
    navigationRef.current.navigate('TabNavigation', {
      screen: 'MyHubStack',
      params: {
        screen: screenName,
        params: params,
      },
    });
  }
}
