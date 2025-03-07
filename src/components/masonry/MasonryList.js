import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

const MasonryList = ({data, numColumns, renderItem, keyExtractor}) => {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const initializeColumns = () => {
      const colArray = Array.from({length: numColumns}, () => []);
      const colHeights = Array.from({length: numColumns}, () => 0);

      data.forEach(item => {
        const shortestColumnIndex = colHeights.indexOf(Math.min(...colHeights));
        colArray[shortestColumnIndex].push(item);
        colHeights[shortestColumnIndex] += item.height;
      });

      setColumns(colArray);
    };

    initializeColumns();
  }, [data, numColumns]);

  const renderColumn = (columnData, columnIndex) => {
    return (
      <View key={`column-${columnIndex}`} style={styles.column}>
        {columnData.map(item => renderItem({item}))}
      </View>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
      }}
      contentContainerStyle={{
        paddingBottom: 50,
      }}>
      <View style={styles.container}>
        {columns.map((columnData, columnIndex) =>
          renderColumn(columnData, columnIndex),
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '98%',
    justifyContent: 'space-between',
    alignSelf: 'center'
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default MasonryList;
