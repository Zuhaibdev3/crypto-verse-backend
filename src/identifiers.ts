const SERVICE_IDENTIFIER = {
  DataManipulationService: Symbol.for("IDataManipulationService"),
  AccessService: Symbol.for("IAccessService"),
  UserRepository: Symbol.for("IUserRepository"),
  UserRepo: Symbol.for("IUserRepo"),
  UserStatusService: Symbol.for("IUserStatusService"),
  UserStatusRepository: Symbol.for("IUserStatusRepository"),
  UserProfileService: Symbol.for("IUserProfileService"),
  UserService: Symbol.for("IUserService"),
  TokenService: Symbol.for("ITokenService"),
  IndustryService: Symbol.for("IIndustryService"),
  IndustryRepository: Symbol.for("IIndustryRepository"),
  DalleService: Symbol.for("IDalleService"),
  DalleRepository: Symbol.for("IDalleRepository"),
  MulterService: Symbol.for('MulterService'),
  FilesService: Symbol.for("IFilesService"),
  FilesRepository: Symbol.for("IFilesRepository"),
}

export default SERVICE_IDENTIFIER;
