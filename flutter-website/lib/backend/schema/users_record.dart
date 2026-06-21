import 'dart:async';

import 'package:collection/collection.dart';

import '/backend/schema/util/firestore_util.dart';
import '/backend/schema/util/schema_util.dart';
import '/backend/schema/enums/enums.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class UsersRecord extends FirestoreRecord {
  UsersRecord._(
    DocumentReference reference,
    Map<String, dynamic> data,
  ) : super(reference, data) {
    _initializeFields();
  }

  // "email" field.
  String? _email;
  String get email => _email ?? '';
  bool hasEmail() => _email != null;

  // "display_name" field.
  String? _displayName;
  String get displayName => _displayName ?? '';
  bool hasDisplayName() => _displayName != null;

  // "photo_url" field.
  String? _photoUrl;
  String get photoUrl => _photoUrl ?? '';
  bool hasPhotoUrl() => _photoUrl != null;

  // "uid" field.
  String? _uid;
  String get uid => _uid ?? '';
  bool hasUid() => _uid != null;

  // "created_time" field.
  DateTime? _createdTime;
  DateTime? get createdTime => _createdTime;
  bool hasCreatedTime() => _createdTime != null;

  // "phone_number" field.
  String? _phoneNumber;
  String get phoneNumber => _phoneNumber ?? '';
  bool hasPhoneNumber() => _phoneNumber != null;

  // "name" field.
  String? _name;
  String get name => _name ?? '';
  bool hasName() => _name != null;

  // "surname" field.
  String? _surname;
  String get surname => _surname ?? '';
  bool hasSurname() => _surname != null;

  // "bio" field.
  String? _bio;
  String get bio => _bio ?? '';
  bool hasBio() => _bio != null;

  // "branch" field.
  String? _branch;
  String get branch => _branch ?? '';
  bool hasBranch() => _branch != null;

  // "other_branches" field.
  List<String>? _otherBranches;
  List<String> get otherBranches => _otherBranches ?? const [];
  bool hasOtherBranches() => _otherBranches != null;

  // "staff_positions" field.
  List<String>? _staffPositions;
  List<String> get staffPositions => _staffPositions ?? const [];
  bool hasStaffPositions() => _staffPositions != null;

  // "office" field.
  String? _office;
  String get office => _office ?? '';
  bool hasOffice() => _office != null;

  // "whatspp" field.
  String? _whatspp;
  String get whatspp => _whatspp ?? '';
  bool hasWhatspp() => _whatspp != null;

  // "facebook" field.
  String? _facebook;
  String get facebook => _facebook ?? '';
  bool hasFacebook() => _facebook != null;

  // "youtube" field.
  String? _youtube;
  String get youtube => _youtube ?? '';
  bool hasYoutube() => _youtube != null;

  // "global_leader" field.
  bool? _globalLeader;
  bool get globalLeader => _globalLeader ?? false;
  bool hasGlobalLeader() => _globalLeader != null;

  // "global_position" field.
  String? _globalPosition;
  String get globalPosition => _globalPosition ?? '';
  bool hasGlobalPosition() => _globalPosition != null;

  // "HOD" field.
  bool? _hod;
  bool get hod => _hod ?? false;
  bool hasHod() => _hod != null;

  // "Director" field.
  bool? _director;
  bool get director => _director ?? false;
  bool hasDirector() => _director != null;

  // "SeniorPastor" field.
  bool? _seniorPastor;
  bool get seniorPastor => _seniorPastor ?? false;
  bool hasSeniorPastor() => _seniorPastor != null;

  // "AssociatePastor" field.
  bool? _associatePastor;
  bool get associatePastor => _associatePastor ?? false;
  bool hasAssociatePastor() => _associatePastor != null;

  // "DirectorListing" field.
  String? _directorListing;
  String get directorListing => _directorListing ?? '';
  bool hasDirectorListing() => _directorListing != null;

  void _initializeFields() {
    _email = snapshotData['email'] as String?;
    _displayName = snapshotData['display_name'] as String?;
    _photoUrl = snapshotData['photo_url'] as String?;
    _uid = snapshotData['uid'] as String?;
    _createdTime = snapshotData['created_time'] as DateTime?;
    _phoneNumber = snapshotData['phone_number'] as String?;
    _name = snapshotData['name'] as String?;
    _surname = snapshotData['surname'] as String?;
    _bio = snapshotData['bio'] as String?;
    _branch = snapshotData['branch'] as String?;
    _otherBranches = getDataList(snapshotData['other_branches']);
    _staffPositions = getDataList(snapshotData['staff_positions']);
    _office = snapshotData['office'] as String?;
    _whatspp = snapshotData['whatspp'] as String?;
    _facebook = snapshotData['facebook'] as String?;
    _youtube = snapshotData['youtube'] as String?;
    _globalLeader = snapshotData['global_leader'] as bool?;
    _globalPosition = snapshotData['global_position'] as String?;
    _hod = snapshotData['HOD'] as bool?;
    _director = snapshotData['Director'] as bool?;
    _seniorPastor = snapshotData['SeniorPastor'] as bool?;
    _associatePastor = snapshotData['AssociatePastor'] as bool?;
    _directorListing = snapshotData['DirectorListing'] as String?;
  }

  static CollectionReference get collection =>
      FirebaseFirestore.instance.collection('users');

  static Stream<UsersRecord> getDocument(DocumentReference ref) =>
      ref.snapshots().map((s) => UsersRecord.fromSnapshot(s));

  static Future<UsersRecord> getDocumentOnce(DocumentReference ref) =>
      ref.get().then((s) => UsersRecord.fromSnapshot(s));

  static UsersRecord fromSnapshot(DocumentSnapshot snapshot) => UsersRecord._(
        snapshot.reference,
        mapFromFirestore(snapshot.data() as Map<String, dynamic>),
      );

  static UsersRecord getDocumentFromData(
    Map<String, dynamic> data,
    DocumentReference reference,
  ) =>
      UsersRecord._(reference, mapFromFirestore(data));

  @override
  String toString() =>
      'UsersRecord(reference: ${reference.path}, data: $snapshotData)';

  @override
  int get hashCode => reference.path.hashCode;

  @override
  bool operator ==(other) =>
      other is UsersRecord &&
      reference.path.hashCode == other.reference.path.hashCode;
}

Map<String, dynamic> createUsersRecordData({
  String? email,
  String? displayName,
  String? photoUrl,
  String? uid,
  DateTime? createdTime,
  String? phoneNumber,
  String? name,
  String? surname,
  String? bio,
  String? branch,
  String? office,
  String? whatspp,
  String? facebook,
  String? youtube,
  bool? globalLeader,
  String? globalPosition,
  bool? hod,
  bool? director,
  bool? seniorPastor,
  bool? associatePastor,
  String? directorListing,
}) {
  final firestoreData = mapToFirestore(
    <String, dynamic>{
      'email': email,
      'display_name': displayName,
      'photo_url': photoUrl,
      'uid': uid,
      'created_time': createdTime,
      'phone_number': phoneNumber,
      'name': name,
      'surname': surname,
      'bio': bio,
      'branch': branch,
      'office': office,
      'whatspp': whatspp,
      'facebook': facebook,
      'youtube': youtube,
      'global_leader': globalLeader,
      'global_position': globalPosition,
      'HOD': hod,
      'Director': director,
      'SeniorPastor': seniorPastor,
      'AssociatePastor': associatePastor,
      'DirectorListing': directorListing,
    }.withoutNulls,
  );

  return firestoreData;
}

class UsersRecordDocumentEquality implements Equality<UsersRecord> {
  const UsersRecordDocumentEquality();

  @override
  bool equals(UsersRecord? e1, UsersRecord? e2) {
    const listEquality = ListEquality();
    return e1?.email == e2?.email &&
        e1?.displayName == e2?.displayName &&
        e1?.photoUrl == e2?.photoUrl &&
        e1?.uid == e2?.uid &&
        e1?.createdTime == e2?.createdTime &&
        e1?.phoneNumber == e2?.phoneNumber &&
        e1?.name == e2?.name &&
        e1?.surname == e2?.surname &&
        e1?.bio == e2?.bio &&
        e1?.branch == e2?.branch &&
        listEquality.equals(e1?.otherBranches, e2?.otherBranches) &&
        listEquality.equals(e1?.staffPositions, e2?.staffPositions) &&
        e1?.office == e2?.office &&
        e1?.whatspp == e2?.whatspp &&
        e1?.facebook == e2?.facebook &&
        e1?.youtube == e2?.youtube &&
        e1?.globalLeader == e2?.globalLeader &&
        e1?.globalPosition == e2?.globalPosition &&
        e1?.hod == e2?.hod &&
        e1?.director == e2?.director &&
        e1?.seniorPastor == e2?.seniorPastor &&
        e1?.associatePastor == e2?.associatePastor &&
        e1?.directorListing == e2?.directorListing;
  }

  @override
  int hash(UsersRecord? e) => const ListEquality().hash([
        e?.email,
        e?.displayName,
        e?.photoUrl,
        e?.uid,
        e?.createdTime,
        e?.phoneNumber,
        e?.name,
        e?.surname,
        e?.bio,
        e?.branch,
        e?.otherBranches,
        e?.staffPositions,
        e?.office,
        e?.whatspp,
        e?.facebook,
        e?.youtube,
        e?.globalLeader,
        e?.globalPosition,
        e?.hod,
        e?.director,
        e?.seniorPastor,
        e?.associatePastor,
        e?.directorListing
      ]);

  @override
  bool isValidKey(Object? o) => o is UsersRecord;
}
