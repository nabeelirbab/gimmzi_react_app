import {StyleSheet} from 'react-native';
import normalize from '../../utils/orientation/normalize';

export const ColorfulStyle = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  content: {
    minHeight: 55,
    flexDirection: 'row',
    marginTop: 12,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableItem: {
    flex: 1,
    padding: 5,
  },
  filterColor: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
    padding: 10,
    borderRadius: 30,
    overflow: 'hidden',
  },
  itemIconNotFound: {
    borderWidth: 2,
    width: 23,
    height: 23,
  },
  itemText: {
    fontWeight: 'bold',
    maxWidth: 90,
    fontSize: normalize(10)
  },
});

export const CleanStyle = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: {
    minHeight: 55,
    flexDirection: 'row',
    marginBottom: 2,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  touchableItem: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIconLayer: {
    position: 'absolute',
    zIndex: 1,
  },
  itemIconNotFound: {
    borderWidth: 2,
    width: 23,
    height: 23,
  },
  filterIcon: {
    zIndex: 2,
    position: 'absolute',
    width: '100%',
  },
  itemTextLayer: {
    zIndex: 3,
    position: 'absolute',
  },
  itemText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  filterText: {
    zIndex: 4,
    position: 'absolute',
    bottom: -5,
    width: '100%',
  },
  triangleTop: {
    width: '100%',
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 180,
    borderBottomWidth: 20,
    borderLeftWidth: 0,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    marginBottom: -1,
  },
  triangleBottom: {
    width: '100%',
    height: 50,
    marginBottom: -50,
  },
  itemDot: {
    zIndex: 5,
    width: 5,
    height: 5,
    borderRadius: 50,
    position: 'absolute',
    bottom: 5,
  },
});

export const FloatingStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    position: 'absolute',
    flex: 5,
    minHeight: 62,
    flexDirection: 'row',
    margin: 15,
    padding: 3,
    overflow: 'hidden',
    borderRadius: 50,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  touchableItem: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIconLayer: {
    position: 'absolute',
  },
  itemIconNotFound: {
    borderWidth: 2,
    width: 23,
    height: 23,
  },
  itemTextLayer: {
    position: 'absolute',
  },
  itemText: {
    fontWeight: 'bold',
    fontSize: 11,
  },
  toggleItem: {
    flex: 1,
  },
  toggleIconLayer: {},
});
