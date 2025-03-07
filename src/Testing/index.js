import {
  View,
  Text,
  KeyboardAvoidingView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useState, useRef} from 'react';
import { Images } from '../themes/Themes';
import { Image } from 'react-native';

const Index = () => {
  const DATA = [
    {
      title: 'B1',
      deals: [
        {title: '1', selected: false,image: Images.img1},
        {title: '2', selected: false,image: Images.img10},
        {title: '3', selected: false,image: Images.img11},
        {title: '4', selected: false,image: Images.img12},
      ],
    },
    {
      title: 'B2',
      deals: [
        {title: '1', selected: false,image: Images.img1},
        {title: '2', selected: false,image: Images.img10},
        {title: '3', selected: false,image: Images.img11},
        {title: '4', selected: false,image: Images.img12},
      ],
    },
  ];

  const [data, setData] = useState(DATA);
  const scrollPositions = useRef({}); // Store scroll positions for each `deals` list

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <RenderItems
          item={item}
          onClickFavorite={async inx => {
            console.log('-->> ', index, inx);
            const updatedList = data.map((it, i) =>
              i === index
                ? {
                    ...it,
                    deals: it.deals.map((_it, idx) =>
                      idx === inx ? {..._it, selected: !_it.selected} : _it,
                    ),
                  }
                : it,
            );
            setData(updatedList);
          }}
          onScroll={(offset) => {
            scrollPositions.current[index] = offset; // Save the scroll position
          }}
          scrollOffset={scrollPositions.current[index] || 0} // Restore the scroll position
        />
      );
    },
    [data],
  );

  return (
    <View style={{flex: 1}}>
      <KeyboardAvoidingView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{height: 100, backgroundColor: 'green', width: '100%'}} />
        <View style={{flex: 1}}>
          <FlatList
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={<Text>Header</Text>}
            stickyHeaderIndices={[0]}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            ListEmptyComponent={<Text>No Data Found</Text>}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

function RenderItems({item, onClickFavorite = () => {}, onScroll = () => {}, scrollOffset = 0}) {
  const keyExtractor = useCallback((_, index) => index.toString(), []);
  const flatListRef = useRef(null);

  React.useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({offset: scrollOffset, animated: false});
    }
  }, [scrollOffset]);

  return (
    <View>
      <Text>{item.title}</Text>
      <View
        style={{
          height: 100,
          width: '100%',
        }}>
        {item?.deals && (
          <FlatList
            ref={flatListRef}
            data={item.deals}
            renderItem={({item, index}) => {
              return (
                <RenderItem
                  key={index}
                  index={index}
                  item={item}
                  onPress={() => onClickFavorite(index)}
                />
              );
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={keyExtractor}
            nestedScrollEnabled
            onScroll={(event) =>
              onScroll(event.nativeEvent.contentOffset.x) // Track scroll offset
            }
            scrollEventThrottle={16}
          />
        )}
      </View>
    </View>
  );
}

function RenderItem({item, index, onPress = () => {}}) {
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      style={{
        height: 100,
        width: 200,
        backgroundColor: item.selected ? 'green' : 'grey',
        marginHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Image
        source={item.image}
        style={{
            height: 100,
            width: 100
        }}
        />
      <Text>{item.title}</Text>
    </TouchableOpacity>
  );
}

export default Index;
