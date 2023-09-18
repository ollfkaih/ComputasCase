import { ComponentProps, ReactNode } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { GestureResponderEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ButtonProps {
  children?: ReactNode;
  onPress: (event: GestureResponderEvent) => void | undefined;
  type?: 'primary' | 'secondary';
  label?: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
}

const Button = ({ children, onPress }: ButtonProps) => {
  return (
    <TouchableOpacity style={{ ...styles.button }} onPress={onPress}>
      <Ionicons size={50} name="ios-radio-button-on" color={'#ebe7ee'} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderWidth: 0,
    borderRadius: 0,
  },

  text: {
    fontSize: 20,
  },
});

export default Button;
