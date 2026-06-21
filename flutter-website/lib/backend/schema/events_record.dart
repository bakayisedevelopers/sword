import 'dart:async';

import 'package:collection/collection.dart';

import '/backend/schema/util/firestore_util.dart';
import '/backend/schema/util/schema_util.dart';
import '/backend/schema/enums/enums.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class EventsRecord extends FirestoreRecord {
  EventsRecord._(
    DocumentReference reference,
    Map<String, dynamic> data,
  ) : super(reference, data) {
    _initializeFields();
  }

  // "title" field.
  String? _title;
  String get title => _title ?? '';
  bool hasTitle() => _title != null;

  // "description" field.
  String? _description;
  String get description => _description ?? '';
  bool hasDescription() => _description != null;

  // "date" field.
  DateTime? _date;
  DateTime? get date => _date;
  bool hasDate() => _date != null;

  // "booking" field.
  bool? _booking;
  bool get booking => _booking ?? false;
  bool hasBooking() => _booking != null;

  // "picture" field.
  String? _picture;
  String get picture => _picture ?? '';
  bool hasPicture() => _picture != null;

  // "global" field.
  bool? _global;
  bool get global => _global ?? false;
  bool hasGlobal() => _global != null;

  // "branch" field.
  DocumentReference? _branch;
  DocumentReference? get branch => _branch;
  bool hasBranch() => _branch != null;

  // "location" field.
  String? _location;
  String get location => _location ?? '';
  bool hasLocation() => _location != null;

  // "location_link" field.
  String? _locationLink;
  String get locationLink => _locationLink ?? '';
  bool hasLocationLink() => _locationLink != null;

  // "price" field.
  double? _price;
  double get price => _price ?? 0.0;
  bool hasPrice() => _price != null;

  // "recurring" field.
  bool? _recurring;
  bool get recurring => _recurring ?? false;
  bool hasRecurring() => _recurring != null;

  // "day" field.
  String? _day;
  String get day => _day ?? '';
  bool hasDay() => _day != null;

  // "time" field.
  DateTime? _time;
  DateTime? get time => _time;
  bool hasTime() => _time != null;

  // "branch_name" field.
  String? _branchName;
  String get branchName => _branchName ?? '';
  bool hasBranchName() => _branchName != null;

  // "repeat" field.
  String? _repeat;
  String get repeat => _repeat ?? '';
  bool hasRepeat() => _repeat != null;

  // "date_details" field.
  String? _dateDetails;
  String get dateDetails => _dateDetails ?? '';
  bool hasDateDetails() => _dateDetails != null;

  // "time_details" field.
  String? _timeDetails;
  String get timeDetails => _timeDetails ?? '';
  bool hasTimeDetails() => _timeDetails != null;

  // "contactPerson" field.
  DocumentReference? _contactPerson;
  DocumentReference? get contactPerson => _contactPerson;
  bool hasContactPerson() => _contactPerson != null;

  // "mininstryName" field.
  String? _mininstryName;
  String get mininstryName => _mininstryName ?? '';
  bool hasMininstryName() => _mininstryName != null;

  // "ministry" field.
  DocumentReference? _ministry;
  DocumentReference? get ministry => _ministry;
  bool hasMinistry() => _ministry != null;

  // "branches" field.
  List<String>? _branches;
  List<String> get branches => _branches ?? const [];
  bool hasBranches() => _branches != null;

  void _initializeFields() {
    _title = snapshotData['title'] as String?;
    _description = snapshotData['description'] as String?;
    _date = snapshotData['date'] as DateTime?;
    _booking = snapshotData['booking'] as bool?;
    _picture = snapshotData['picture'] as String?;
    _global = snapshotData['global'] as bool?;
    _branch = snapshotData['branch'] as DocumentReference?;
    _location = snapshotData['location'] as String?;
    _locationLink = snapshotData['location_link'] as String?;
    _price = castToType<double>(snapshotData['price']);
    _recurring = snapshotData['recurring'] as bool?;
    _day = snapshotData['day'] as String?;
    _time = snapshotData['time'] as DateTime?;
    _branchName = snapshotData['branch_name'] as String?;
    _repeat = snapshotData['repeat'] as String?;
    _dateDetails = snapshotData['date_details'] as String?;
    _timeDetails = snapshotData['time_details'] as String?;
    _contactPerson = snapshotData['contactPerson'] as DocumentReference?;
    _mininstryName = snapshotData['mininstryName'] as String?;
    _ministry = snapshotData['ministry'] as DocumentReference?;
    _branches = getDataList(snapshotData['branches']);
  }

  static CollectionReference get collection =>
      FirebaseFirestore.instance.collection('events');

  static Stream<EventsRecord> getDocument(DocumentReference ref) =>
      ref.snapshots().map((s) => EventsRecord.fromSnapshot(s));

  static Future<EventsRecord> getDocumentOnce(DocumentReference ref) =>
      ref.get().then((s) => EventsRecord.fromSnapshot(s));

  static EventsRecord fromSnapshot(DocumentSnapshot snapshot) => EventsRecord._(
        snapshot.reference,
        mapFromFirestore(snapshot.data() as Map<String, dynamic>),
      );

  static EventsRecord getDocumentFromData(
    Map<String, dynamic> data,
    DocumentReference reference,
  ) =>
      EventsRecord._(reference, mapFromFirestore(data));

  @override
  String toString() =>
      'EventsRecord(reference: ${reference.path}, data: $snapshotData)';

  @override
  int get hashCode => reference.path.hashCode;

  @override
  bool operator ==(other) =>
      other is EventsRecord &&
      reference.path.hashCode == other.reference.path.hashCode;
}

Map<String, dynamic> createEventsRecordData({
  String? title,
  String? description,
  DateTime? date,
  bool? booking,
  String? picture,
  bool? global,
  DocumentReference? branch,
  String? location,
  String? locationLink,
  double? price,
  bool? recurring,
  String? day,
  DateTime? time,
  String? branchName,
  String? repeat,
  String? dateDetails,
  String? timeDetails,
  DocumentReference? contactPerson,
  String? mininstryName,
  DocumentReference? ministry,
}) {
  final firestoreData = mapToFirestore(
    <String, dynamic>{
      'title': title,
      'description': description,
      'date': date,
      'booking': booking,
      'picture': picture,
      'global': global,
      'branch': branch,
      'location': location,
      'location_link': locationLink,
      'price': price,
      'recurring': recurring,
      'day': day,
      'time': time,
      'branch_name': branchName,
      'repeat': repeat,
      'date_details': dateDetails,
      'time_details': timeDetails,
      'contactPerson': contactPerson,
      'mininstryName': mininstryName,
      'ministry': ministry,
    }.withoutNulls,
  );

  return firestoreData;
}

class EventsRecordDocumentEquality implements Equality<EventsRecord> {
  const EventsRecordDocumentEquality();

  @override
  bool equals(EventsRecord? e1, EventsRecord? e2) {
    const listEquality = ListEquality();
    return e1?.title == e2?.title &&
        e1?.description == e2?.description &&
        e1?.date == e2?.date &&
        e1?.booking == e2?.booking &&
        e1?.picture == e2?.picture &&
        e1?.global == e2?.global &&
        e1?.branch == e2?.branch &&
        e1?.location == e2?.location &&
        e1?.locationLink == e2?.locationLink &&
        e1?.price == e2?.price &&
        e1?.recurring == e2?.recurring &&
        e1?.day == e2?.day &&
        e1?.time == e2?.time &&
        e1?.branchName == e2?.branchName &&
        e1?.repeat == e2?.repeat &&
        e1?.dateDetails == e2?.dateDetails &&
        e1?.timeDetails == e2?.timeDetails &&
        e1?.contactPerson == e2?.contactPerson &&
        e1?.mininstryName == e2?.mininstryName &&
        e1?.ministry == e2?.ministry &&
        listEquality.equals(e1?.branches, e2?.branches);
  }

  @override
  int hash(EventsRecord? e) => const ListEquality().hash([
        e?.title,
        e?.description,
        e?.date,
        e?.booking,
        e?.picture,
        e?.global,
        e?.branch,
        e?.location,
        e?.locationLink,
        e?.price,
        e?.recurring,
        e?.day,
        e?.time,
        e?.branchName,
        e?.repeat,
        e?.dateDetails,
        e?.timeDetails,
        e?.contactPerson,
        e?.mininstryName,
        e?.ministry,
        e?.branches
      ]);

  @override
  bool isValidKey(Object? o) => o is EventsRecord;
}
