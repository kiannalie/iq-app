import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SideMenu from '../../components/organisms/SideMenu';
import { boardService, BoardType as ServiceBoardType } from '../../services/boardService';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

interface TagColor {
  name: string;
  color: string;
}

const TAG_COLORS: TagColor[] = [
  { name: 'WELLNESS', color: '#4169E1' },
  { name: 'FAMILY', color: '#8B0000' },
  { name: 'PRODUCT', color: '#B8860B' },
  { name: 'PERSONAL DEVELOPMENT', color: '#8B0000' },
];

interface BoardType {
  name: string;
  color: string;
}

const INITIAL_BOARD_TYPES: BoardType[] = [
  { name: 'Personal', color: '#1a237e' },
  { name: 'Work', color: '#8B0000' },
  { name: 'Health', color: '#B8860B' },
  { name: 'Education', color: '#4169E1' },
];

const AVAILABLE_COLORS = [
  '#F4C430', // Gold
  '#E57373', // Red
  '#8B0000', // Dark Red
  '#B8860B', // Dark Goldenrod
  '#6B4423', // Brown
  '#000000', // Black
  '#2E8B57', // Sea Green
  '#1a237e', // Navy Blue
  '#6A0DAD', // Purple
  '#7B68EE', // Medium Slate Blue
  '#FFB6C1', // Light Pink
  '#FFFFFF', // White
];

const AddBoardScreen: React.FC = () => {
  const navigation = useNavigation();
  const [boardName, setBoardName] = useState('');
  const [selectedTag, setSelectedTag] = useState<TagColor>(TAG_COLORS[0]);
  const [boardTypes, setBoardTypes] = useState<BoardType[]>(INITIAL_BOARD_TYPES);
  const [selectedBoardType, setSelectedBoardType] = useState<BoardType | null>(null);
  const [isBoardTypeExpanded, setIsBoardTypeExpanded] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeColor, setNewTypeColor] = useState('#1a237e');

  const handleFinish = async () => {
    if (boardName.trim()) {
      try {
        // Save board to local storage with selected board type
        // If a board type is selected, save it as the first item in the array
        const typesToSave = selectedBoardType
          ? [selectedBoardType, ...boardTypes.filter(t => t.name !== selectedBoardType.name)]
          : boardTypes;
        await boardService.createBoard(boardName.trim(), typesToSave);
        // Navigate back to library
        navigation.goBack();
      } catch (error) {
        console.error('Error saving board:', error);
        Alert.alert('Error', 'Failed to save board. Please try again.');
      }
    } else {
      Alert.alert('Required', 'Please enter a board name');
    }
  };

  const handleAddType = () => {
    if (newTypeName.trim()) {
      setBoardTypes([...boardTypes, { name: newTypeName, color: newTypeColor }]);
      setNewTypeName('');
      setShowAddTypeModal(false);
    }
  };

  const handleSelectBoardType = (type: BoardType) => {
    setSelectedBoardType(type);
    setIsBoardTypeExpanded(false);
  };

  const toggleBoardTypeExpanded = () => {
    setIsBoardTypeExpanded(!isBoardTypeExpanded);
  };

  const handleMenuPress = () => {
    setShowSideMenu(true);
  };

  const handleCloseSideMenu = () => {
    setShowSideMenu(false);
  };

  const handleSettings = () => {
    console.log('Settings pressed');
  };

  const handleFeedback = () => {
    console.log('Feedback pressed');
  };

  const handleLogout = () => {
    console.log('Logout pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={COLORS.white} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <Ionicons name="menu" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Name Section with Tag */}
        <View style={styles.section}>
          <View style={styles.nameCardContainer}>
            <View style={styles.nameCard}>
              <Text style={styles.nameCardText}>
                {boardName || 'Board Name'}
              </Text>
              <TouchableOpacity
                style={[
                  styles.tagButton,
                  { backgroundColor: selectedBoardType ? selectedBoardType.color : selectedTag.color }
                ]}
                onPress={() => setShowTagSelector(true)}
              >
                <Text style={styles.tagButtonText}>
                  {selectedBoardType ? selectedBoardType.name : selectedTag.name}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Board Name Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>BOARD NAME</Text>
          <TextInput
            style={styles.input}
            value={boardName}
            onChangeText={setBoardName}
            placeholder="Enter board name"
            placeholderTextColor={COLORS.white + '60'}
          />
        </View>

        {/* Board Type Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.boardTypeLabelContainer}
            onPress={toggleBoardTypeExpanded}
          >
            <Text style={styles.sectionLabel}>BOARD TYPE</Text>
            <Ionicons
              name={isBoardTypeExpanded ? "chevron-down" : "chevron-forward"}
              size={20}
              color={COLORS.white}
            />
          </TouchableOpacity>

          {isBoardTypeExpanded ? (
            <View style={styles.boardTypeContainerExpanded}>
              {boardTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.boardTypePill, { backgroundColor: type.color }]}
                  onPress={() => handleSelectBoardType(type)}
                >
                  <Text style={styles.boardTypePillText}>{type.name}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.addTypeButton}
                onPress={() => setShowAddTypeModal(true)}
              >
                <Ionicons name="add" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          ) : selectedBoardType ? (
            <View style={styles.boardTypeContainerCollapsed}>
              <View
                style={[styles.boardTypePill, { backgroundColor: selectedBoardType.color }]}
              >
                <Text style={styles.boardTypePillText}>{selectedBoardType.name}</Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* Finished Button */}
        <View style={styles.finishedButtonContainer}>
          <TouchableOpacity style={styles.finishedButton} onPress={handleFinish}>
            <Text style={styles.finishedButtonText}>finished</Text>
            <Ionicons name="checkmark" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Tag Selector Modal */}
      <Modal
        visible={showTagSelector}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTagSelector(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowTagSelector(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Tag</Text>
            {TAG_COLORS.map((tag) => (
              <TouchableOpacity
                key={tag.name}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedTag(tag);
                  setShowTagSelector(false);
                }}
              >
                <View style={[styles.tagPreview, { backgroundColor: tag.color }]} />
                <Text style={styles.modalOptionText}>{tag.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add Type Modal */}
      <Modal
        visible={showAddTypeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddTypeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowAddTypeModal(false)}
        >
          <View style={styles.addTypeModalContent} onStartShouldSetResponder={() => true}>
            {/* Preview - Auto populated color and title */}
            <View style={[styles.previewCard, { backgroundColor: newTypeColor }]}>
              <Text style={styles.previewText}>
                {newTypeName || 'SAMPLE NAME'}
              </Text>
            </View>

            {/* Tab Name Row - Label, Input, and Checkmark on same line */}
            <View style={styles.tabNameRow}>
              <Text style={styles.tabNameLabel}>TAB NAME</Text>
              <TextInput
                style={styles.tabNameInputInline}
                value={newTypeName}
                onChangeText={setNewTypeName}
                placeholder=""
                placeholderTextColor={COLORS.white + '60'}
              />
              <TouchableOpacity
                style={styles.checkmarkButton}
                onPress={handleAddType}
              >
                <Ionicons name="checkmark" size={28} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.tabNameUnderline} />

            {/* Color Grid */}
            <View style={styles.colorGrid}>
              {AVAILABLE_COLORS.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    color === '#FFFFFF' && styles.colorCircleWhite,
                    newTypeColor === color && styles.selectedColorCircle,
                  ]}
                  onPress={() => {
                    setNewTypeColor(color);
                    Keyboard.dismiss();
                  }}
                />
              ))}
            </View>

            {/* Bottom Button - Only Add/Close button */}
            <View style={styles.addTypeModalButtons}>
              <TouchableOpacity
                style={styles.addTypeModalButton}
                onPress={() => setShowAddTypeModal(false)}
              >
                <Ionicons name="add" size={28} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <SideMenu
        visible={showSideMenu}
        onClose={handleCloseSideMenu}
        onSettings={handleSettings}
        onFeedback={handleFeedback}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  searchButton: {
    padding: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    padding: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  pageTitle: {
    fontSize: FONT_SIZES.small,
    color: COLORS.white + '80',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
  },
  section: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
  },
  sectionLabel: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: SPACING.sm,
    letterSpacing: 1,
  },
  nameCardContainer: {
    alignItems: 'center',
  },
  nameCard: {
    width: '60%',
    height: 120,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  nameCardText: {
    fontSize: FONT_SIZES.large,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  tagButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 8,
  },
  tagButtonText: {
    fontSize: FONT_SIZES.small - 2,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.white,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.medium,
    color: COLORS.white,
  },
  boardTypeLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  boardTypeContainerExpanded: {
    borderWidth: 2,
    borderColor: COLORS.white + '80',
    borderRadius: 12,
    padding: SPACING.md,
    minHeight: 180,
  },
  boardTypeContainerCollapsed: {
    borderWidth: 2,
    borderColor: COLORS.white + '80',
    borderRadius: 12,
    padding: SPACING.md,
    alignSelf: 'flex-start',
  },
  boardTypePill: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 25,
    marginBottom: SPACING.sm,
    alignItems: 'center',
  },
  boardTypePillText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
  addTypeButton: {
    alignSelf: 'flex-start',
    marginTop: SPACING.sm,
  },
  finishedButtonContainer: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
    marginBottom: SPACING.xxl,
  },
  finishedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a237e',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 25,
    gap: SPACING.sm,
  },
  finishedButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.xl,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary + '20',
  },
  modalOptionText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.primary,
  },
  tagPreview: {
    width: 30,
    height: 20,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: FONT_SIZES.medium,
    color: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  modalButton: {
    backgroundColor: '#1a237e',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
  addTypeModalContent: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: SPACING.xl,
    width: '85%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: COLORS.white + '80',
  },
  previewCard: {
    borderRadius: 25,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    minHeight: 60,
  },
  previewText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  tabNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabNameLabel: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.white,
    fontWeight: '600',
    letterSpacing: 1,
    marginRight: SPACING.sm,
  },
  tabNameInputInline: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
    color: COLORS.white,
    paddingVertical: SPACING.xs,
  },
  checkmarkButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  tabNameUnderline: {
    height: 2,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.lg,
    marginTop: SPACING.xs,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  colorCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: SPACING.md,
    borderWidth: 0,
  },
  colorCircleWhite: {
    borderWidth: 2,
    borderColor: COLORS.primary + '40',
  },
  selectedColorCircle: {
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  addTypeModalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: SPACING.md,
  },
  addTypeModalButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddBoardScreen;
