import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import {Color} from '../../common/Color';
import {Size} from '../../common/Size';
import {CFont} from '../../common/CFont';

export default class CTextField extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChangeText = input => {
    const {onChangeText} = this.props;
    if (onChangeText) {
      onChangeText(input);
    }
  };

  render() {
    const {
      style,
      textColor,
      isNoBorder,
      keyType,
      isEdit,
      initText,
      maxLength,
    } = this.props;
    var text_color = Color.c0a214b;
    var border = {borderWidth: Size.height(2)};
    if (textColor) {
      text_color = textColor;
    }
    if (isNoBorder) {
      border = {};
    }
    return (
      <View style={[styles.container, style, border]}>
        <TextInput
          onChangeText={this.onChangeText}
          maxLength={maxLength}
          underlineColorAndroid="transparent"
          autoCorrect={false}
          contextMenuHidden={true}
          autoCapitalize="none"
          keyboardType={keyType != null ? keyType : 'default'}
          editable={isEdit != null ? isEdit : true}
          style={[CFont.textinputbold, {color: Color.cffffff}]}>
          <Text style={{color: text_color}}>{initText}</Text>
        </TextInput>
      </View>
    );
  }
}

CTextField.propTypes = {
  onPress: PropTypes.func,
  editable: PropTypes.bool,
  onChangeText: PropTypes.func,
  textColor: PropTypes.string,
  initText: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    height: Size.height(48),
    width: '100%',
    borderColor: Color.c0a214b,
    borderStyle: 'solid',
    backgroundColor: Color.cffffff,
    borderRadius: Size.height(15),
    paddingLeft: Size.width(15),
    paddingRight: Size.width(15),
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
