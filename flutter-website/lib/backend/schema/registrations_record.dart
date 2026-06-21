import 'dart:async';

import 'package:collection/collection.dart';

import '/backend/schema/util/firestore_util.dart';
import '/backend/schema/util/schema_util.dart';
import '/backend/schema/enums/enums.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class RegistrationsRecord extends FirestoreRecord {
  RegistrationsRecord._(
    DocumentReference reference,
    Map<String, dynamic> data,
  ) : super(reference, data) {
    _initializeFields();
  }

  // "name" field.
  String? _name;
  String get name => _name ?? '';
  bool hasName() => _name != null;

  // "surname" field.
  String? _surname;
  String get surname => _surname ?? '';
  bool hasSurname() => _surname != null;

  // "cell" field.
  String? _cell;
  String get cell => _cell ?? '';
  bool hasCell() => _cell != null;

  // "message" field.
  String? _message;
  String get message => _message ?? '';
  bool hasMessage() => _message != null;

  // "eventName" field.
  String? _eventName;
  String get eventName => _eventName ?? '';
  bool hasEventName() => _eventName != null;

  // "branch" field.
  String? _branch;
  String get branch => _branch ?? '';
  bool hasBranch() => _branch != null;

  // "date" field.
  DateTime? _date;
  DateTime? get date => _date;
  bool hasDate() => _date != null;

  void _initializeFields() {
    _name = snapshotData['name'] as String?;
    _surname = snapshotData['surname'] as String?;
    _cell = snapshotData['cell'] as String?;
    _message = snapshotData['message'] as String?;
    _eventName = snapshotData['eventName'] as String?;
    _branch = snapshotData['branch'] as String?;
    _date = snapshotData['date'] as DateTime?;
  }

  static CollectionReference get collection =>
      FirebaseFirestore.instance.collection('registrations');

  static Stream<RegistrationsRecord> getDocument(DocumentReference ref) =>
      ref.snapshots().map((s) => RegistrationsRecord.fromSnapshot(s));

  static Future<RegistrationsRecord> getDocumentOnce(DocumentReference ref) =>
      ref.get().then((s) => RegistrationsRecord.fromSnapshot(s));

  static RegistrationsRecord fromSnapshot(DocumentSnapshot snapshot) =>
      RegistrationsRecord._(
        snapshot.reference,
        mapFromFirestore(snapshot.data() as Map<String, dynamic>),
      );

  static RegistrationsRecord getDocumentFromData(
    Map<String, dynamic> data,
    DocumentReference reference,
  ) =>
      RegistrationsRecord._(reference, mapFromFirestore(data));

  @override
  String toString() =>
      'RegistrationsRecord(reference: ${reference.path}, data: $snapshotData)';

  @override
  int get hashCode => reference.path.hashCode;

  @override
  bool operator ==(other) =>
      other is RegistrationsRecord &&
      reference.path.hashCode == other.reference.path.hashCode;
}

Map<String, dynamic> createRegistrationsRecordData({
  String? name,
  String? surname,
  String? cell,
  String? message,
  String? eventName,
  String? branch,
  DateTime? date,
}) {
  final firestoreData = mapToFirestore(
    <String, dynamic>{
      'name': name,
      'surname': surname,
      'cell': cell,
      'message': message,
      'eventName': eventName,
      'branch': branch,
      'date': date,
    }.withoutNulls,
  );

  return firestoreData;
}

class RegistrationsRecordDocumentEquality
    implements Equality<RegistrationsRecord> {
  const RegistrationsRecordDocumentEquality();

  @override
  bool equals(RegistrationsRecord? e1, RegistrationsRecord? e2) {
    return e1?.name == e2?.name &&
        e1?.surname == e2?.surname &&
        e1?.cell == e2?.cell &&
        e1?.message == e2?.message &&
        e1?.eventName == e2?.eventName &&
        e1?.branch == e2?.branch &&
        e1?.date == e2?.date;
  }

  @override
  int hash(RegistrationsRecord? e) => const ListEquality().hash([
        e?.name,
        e?.surname,
        e?.cell,
        e?.message,
        e?.eventName,
        e?.branch,
        e?.date
      ]);

  @override
  bool isValidKey(Object? o) => o is RegistrationsRecord;
}
