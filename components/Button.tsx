import { ComponentProps, ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GestureResponderEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ButtonProps {
  children?: ReactNode;
  onPress: (event: GestureResponderEvent) => void | undefined;
  type?: 'primary' | 'secondary';
  label?: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
}

const Button = ({ children, onPress, type = 'primary', label, icon }: ButtonProps) => {
  return (
    <TouchableOpacity style={{ ...styles.button, ...styles[type] }} onPress={onPress}>
      {icon && <Ionicons style={styles.icon} size={25} name={icon} />}
      {label && <Text style={styles.text}>{label}</Text>}
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    height: 50,
    borderWidth: 3,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#C88FF8',
    borderColor: '#C88FF8',
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C88FF8',
  },

  icon: {},
  text: {
    fontSize: 20,
  },
});

export default Button;
