import { gql } from "graphql-tag";

export default gql`
  type Schedule {
    _id: ID!
    active: Boolean
    serviceCategory: [Code!]
    serviceType: [Code!]
    specialty: [Code!]
    actor: [Reference!]
    planningHorizon: Period
    comment: String
  }
  input ScheduleInput {
    serviceCategory: [CodeInput!]
    serviceType: [CodeInput!]
    specialty: [CodeInput!]
    actor: [ReferenceInput!]!
    planningHorizon: PeriodInput
    comment: String
  }
  enum ParticipantType {
    PATIENT
    PRACITIONER
  }
  enum ParticipationStatus {
    ACCEPTED
    DECLINED
    TENTATIVE
    NEEDS_ACTION
  }
  type Participant {
    type: ParticipantType
    actor: Reference
    status: ParticipationStatus
  }
  input ParticipantInput {
    type: ParticipantType
    actor: ReferenceInput
    status: ParticipationStatus
  }
  enum SlotStatus {
    BUSY
    FREE
  }
  type Slot {
    _id: ID!
    scheduleId: ID!
    status: SlotStatus!
    serviceCategory: [Code!]
    serviceType: [Code!]
    specialty: [Code!]
    appointmentType: Code
    start: DateTime
    end: DateTime
    comments: String
  }
  input SlotInput {
    _id: ID
    scheduleId: ID!
    status: SlotStatus!
    serviceCategory: [CodeInput!]
    serviceType: [CodeInput!]
    specialty: [CodeInput!]
    appointmentType: CodeInput
    start: DateTime
    end: DateTime
    comments: String
  }
  enum AppointmentStatus {
    PROPOSED
    PENDING
    BOOKED
    ARRIVED
    FULFILLED
    CANCELLED
    NOSHOW
    ENTEREDINERROR
    CHECKEDIN
    WAITLIST
  }
  type Appointment {
    _id: ID
    schedule: [Reference!]
    status: AppointmentStatus
    cancellationReason: String
    serviceCategory: [Code!]
    serviceType: [Code!]
    specialty: [Code!]
    actor: [Reference!]
    comment: String
    appointmentType: Code
    reason: [Code!]
    description: String
    start: DateTime
    end: DateTime
    patientInstruction: String
    basedOn: Reference
    subject: [Reference!]
    participants: [Participant!]
  }
  input AppointmentInput {
    _id: ID
    schedule: [ReferenceInput!]
    status: AppointmentStatus
    cancellationReason: String
    serviceCategory: [CodeInput!]
    serviceType: [CodeInput!]
    specialty: [CodeInput!]
    actor: [ReferenceInput!]
    comment: String
    appointmentType: CodeInput
    reason: [CodeInput!]
    description: String
    start: DateTime
    end: DateTime
    patientInstruction: String
    basedOn: ReferenceInput
    subject: [ReferenceInput!]
    participants: [ParticipantInput!]
  }
  extend type Query {
    getSchedule(_id: ID!): Schedule
    getSchedules: [Schedule]
    getAppointment(_id: ID!): Appointment
    getAppointments(
      scheduleId: ID!
      start: DateTime!
      end: DateTime!
    ): [Appointment!]
    getSlots(scheduleId: ID!, start: DateTime!, end: DateTime!): [Slot!]
    getAppointmentTypes: [Code!]
    getAppointmentReasons: [Code!]
    getScheduleCodes: [Code!]
  }
  extend type Mutation {
    addSchedule(schedule: ScheduleInput!): SaveResult!
    updateSchedule(schedule: ScheduleInput!): SaveResult!
    deleteSchedule(id: String!): SaveResult!
    addAppointment(appointment: AppointmentInput!): SaveResult!
    updateAppointment(appointment: AppointmentInput!): SaveResult!
    deleteAppointment(id: String!): SaveResult!
    addSlot(appointment: SlotInput!): SaveResult!
    updateSlot(appointment: SlotInput!): SaveResult!
    deleteSlot(id: String!): SaveResult!
  }
`;
