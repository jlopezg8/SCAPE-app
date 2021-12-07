import React from 'react';
import { Avatar, List } from 'react-native-paper';

import { Employee } from "../models";

type EmployeeListItemProps =
  Omit<React.ComponentProps<typeof List.Item>, 'title' | 'description' | 'left'>
  & { employee: Employee; };

export function EmployeeListItem(
  { employee, ...otherProps }: EmployeeListItemProps
) {
  const { firstName, lastName } = employee;
  return (
    <List.Item
      title={`${firstName} ${lastName}`}
      description="Cargo"
      left={props => <EmployeeAvatar employee={employee} props={props} />}
      {...otherProps}
    />
  );
}

function EmployeeAvatar<SidePropsType>(
  { employee, props }: { employee: Employee; props: SidePropsType }
) {
  const { photo, firstName, lastName } = employee;
  return photo
    ? <Avatar.Image
        source={{ uri: `data:image/jpg;base64,${photo}` }}
        size={48}
        {...props} 
      />
    : <Avatar.Text
        label={firstName[0] + lastName[0]}
        size={48}
        {...props}
        color="white"
      />;
}
