import { FieldArray, useField } from 'formik';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Divider, Subheading } from 'react-native-paper';

import Layout from '../constants/Layout';
import Schedule, { getScheduleInitialValues } from '../models/Schedule';
import { DayOfWeekDropDown, FormikInputProps, TimePicker } from './formik';
import { HelperText } from './misc';

/**
 * @requires formik.Formik for Formik state and helpers
 * @requires react-native-paper.Provider for the Material Design components
 */
export default function SchedulesPicker(
  { label, name, helperText }: FormikInputProps
) {
  const [, { touched, error }] = useField(name);
  const isError = touched && typeof error === 'string';
  return (
    <View>
      <Subheading style={styles.label}>{label}</Subheading>
      <SchedulesList name={name} />
      <Divider />
      <HelperText
        label={label}
        error={isError}
        helperText={helperText}
        errorText={isError ? error : undefined}
      />
    </View>
  );
}

function SchedulesList({ name }: { name: string }) {
  const [{ value: schedules }] = useField<Schedule[]>(name);
  return (
    <FieldArray
      name={name}
      render={arrayHelpers => <>
        {schedules && schedules.map((_schedule, index) =>
          <SchedulesListItem
            key={index}
            name={`${name}[${index}]`}
            removeThisItem={() => arrayHelpers.remove(index)}
          />
        )}
        <AddScheduleButton
          addSchedule={() => arrayHelpers.push(getScheduleInitialValues())}
        />
      </>}
    />
  );
}

function SchedulesListItem(
  { name, removeThisItem }: { name: string; removeThisItem: () => void; }
) {
  return (
    <View style={styles.schedulesListItem}>
      <SchedulePicker name={name}/>
      <Button onPress={removeThisItem}>X</Button>
    </View>
  );
}

function AddScheduleButton({ addSchedule }: { addSchedule: () => void }) {
  return (
    <Button
      onPress={addSchedule}
      style={styles.addScheduleButton}
    >
      Añadir horario
    </Button>
  );
}

export function SchedulePicker({ name }: { name: string }) {
  const dayOfWeekKey: keyof Schedule = 'dayOfWeek';
  const startTimeKey: keyof Schedule = 'startTime';
  const endTimeKey: keyof Schedule = 'endTime';
  return (
    <View style={styles.schedulePicker}>
      <DayOfWeekDropDown
        label="Día de la semana"
        name={`${name}.${dayOfWeekKey}`}
      />
      <Gutter size={Layout.padding} />
      <TimePicker
        label="Hora de inicio"
        name={`${name}.${startTimeKey}`}
      />
      <Gutter size={Layout.padding} />
      <TimePicker
        label="Hora de fin"
        name={`${name}.${endTimeKey}`}
      />
    </View>
  );
}

function Gutter({ size }: { size: number }) {
  return <View style={{ width: size }}></View>
}

const styles = StyleSheet.create({
  label: {
    paddingLeft: 12,
  },
  schedulesListItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  addScheduleButton: {
    alignSelf: 'center',
  },
  schedulePicker: {
    flexDirection: 'row',
    flex: 1,
  }
});
