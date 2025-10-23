import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onFocus?: () => void;
  value?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search podcasts...',
  onSearch,
  onFocus,
  value: controlledValue,
}) => {
  const [internalValue, setInternalValue] = useState('');
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChangeText = (text: string) => {
    if (controlledValue === undefined) {
      setInternalValue(text);
    }
    // Optionally trigger search on every character change
    // onSearch(text);
  };

  const handleSearch = () => {
    onSearch(value);
  };

  const handleClear = () => {
    const newValue = '';
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onSearch(newValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={20} color={COLORS.white} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.white + '80'}
          value={value}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSearch}
          onFocus={onFocus}
          returnKeyType="search"
        />

        {value.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Ionicons name="close-circle" size={20} color={COLORS.white + '80'} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary + '40', // Semi-transparent olive
    borderRadius: 25,
    paddingHorizontal: SPACING.md,
    height: 50,
  },
  searchButton: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
    color: COLORS.white,
    height: '100%',
  },
  clearButton: {
    marginLeft: SPACING.sm,
  },
});

export default SearchBar;