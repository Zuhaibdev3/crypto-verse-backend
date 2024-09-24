import IUserRepository from './iuser.repository';
import Repository from '../../../repository/repository';
import { injectable } from 'inversify';
import User from './user.entity';
import { UserModel } from './user.entity';
import { FilterQuery } from 'mongoose';
import { generateTokenDataDTO } from '../../../Services/dto/token.dto';
import { PaginationDataDTO } from '../../../dto/common.dto';
import mongoose, { ObjectId } from 'mongoose';
import { Schema } from 'mongoose';
import { DatabaseId } from '../../../../types';


@injectable()
export default class UserRepository extends Repository<User> implements IUserRepository {
  model = UserModel

  getUserTokenData(query: FilterQuery<any> | undefined): Promise<any> {
    return this.model
      .findOne(query, {}, { lean: true })
      .populate({
        path: "role",
        select: "code"
      })
      .select("role business_id _id email")
      .exec();
  }

  findAllUsers(query: any, pagination: any): Promise<any> {
    const skip = (pagination.page - 1) * pagination.limit;
    console.log('skip ', skip);
    console.log('pagination.limit ', pagination.limit);
    return this.model.
      find(query, {}, { lean: true })
      // .select('email')
      .populate({
        path: "roleId",
      })
      .populate({
        path: "departmentId",
        match: { isDeleted: false } // Filter based on isDeleted property
      })
      .skip(skip)
      .limit(pagination.limit)
      .lean()
      .exec();
  }

  findAllUserAggregate(query: any, pagination: any, userId: DatabaseId): any {
    const skip = (pagination.page - 1) * pagination.limit;
    let andMatchQuery = [];
    if (query.includeMyProfile) {
      andMatchQuery = [
        { $eq: ["$businessId", query.businessId] },
        { $eq: ["$isDeleted", false] },
        pagination?.query?.roleId ? { $eq: ["$roleId", { $toObjectId: pagination?.query?.roleId }] } : {},
        pagination?.query?.departmentId ? { $eq: ["$departmentId", { $toObjectId: pagination?.query?.departmentId }] } : {},
        pagination?.query?.isActive !== null && pagination?.query?.isActive !== '' ? { $eq: ["$isActive", query.isActive] } : {},
      ];
    } else {
      andMatchQuery = [
        { $ne: ["$_id", userId] },
        { $eq: ["$businessId", query.businessId] },
        { $eq: ["$isDeleted", false] },
        pagination?.query?.roleId ? { $eq: ["$roleId", { $toObjectId: pagination?.query?.roleId }] } : {},
        pagination?.query?.departmentId ? { $eq: ["$departmentId", { $toObjectId: pagination?.query?.departmentId }] } : {},
        // to filter users by status
        pagination?.query?.userStatus === "notInvited" ? { $eq: ["$invitationHash", ""] } : {},
        pagination?.query?.userStatus === "invited" ? { $ne: ["$invitationHash", ""] } : {},
        pagination?.query?.userStatus !== "all" ? { $eq: ["$password", ""] } : {},
        pagination?.query?.isActive !== null && pagination?.query?.isActive !== '' ? { $eq: ["$isActive", query.isActive] } : {},
      ];
    }
    const result = this.model.aggregate([
      {
        $match: {
          // businessId: query.businessId,
          // roleId: pagination.query.roleId,
          $expr: {
            $and: andMatchQuery
          }
        }
      },
      { $skip: skip },
      { $limit: pagination.limit },
      {
        $lookup: {
          from: "roles",
          let: { roleId: "$roleId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$roleId"] },
                  ]
                }
              }
            },
            {
              $addFields: {
                features: {
                  $map: {
                    input: "$features",
                    as: "f",
                    in: { $toObjectId: "$$f" }
                  }
                }
              }
            },
            {
              $lookup: {
                from: "features",
                let: { features: "$features" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $in: ["$_id", "$$features"] },
                        ]
                      }
                    }
                  },
                  {
                    $project: {
                      name: 1,
                      modifier: 1
                    }
                  }
                ],
                as: "features"
              }
            }
          ],
          as: "roleId"
        }
      },
      {
        $addFields: {
          roleId: {
            $ifNull: [{ $arrayElemAt: ["$roleId", 0] }, {}]
          }
        }
      },
      {
        $lookup: {
          from: "department",
          let: { departmentId: "$departmentId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$departmentId"] } } },
          ],
          as: "departmentId"
        }
      },
      {
        $addFields: {
          departmentId: {
            $ifNull: [{ $arrayElemAt: ["$departmentId", 0] }, {}]
          }
        }
      },
    ]);

    return result
  }

  findAllUserUsingRoleAggregate(query: any, pagination: any): any {
    const skip = (pagination.page - 1) * pagination.limit;
    let result: any
    try {
      let a = [
        {
          $match: {
            $and: [
              { businessId: new mongoose.Types.ObjectId(query.businessId as any) },
              { roleId: new mongoose.Types.ObjectId(query.roleId as any) },
              { isDeleted: false }
            ]
          },
        },
        {
          $lookup: {
            from: "roles",
            let: { roleId: "$roleId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$_id", "$$roleId"] },
                    ]
                  }
                }
              },
              {
                $addFields: {
                  features: {
                    $map: {
                      input: "$features",
                      as: "f",
                      in: { $toObjectId: "$$f" }
                    }
                  }
                }
              },
              {
                $lookup: {
                  from: "features",
                  let: { features: "$features" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $in: ["$_id", "$$features"] },
                          ]
                        }
                      }
                    },
                    {
                      $project: {
                        name: 1,
                        modifier: 1
                      }
                    }
                  ],
                  as: "features"
                }
              },

            ],
            as: "roleId"
          }
        },
        {
          $addFields: {
            roleId: {
              $ifNull: [{ $arrayElemAt: ["$roleId", 0] }, {}]
            }
          }
        },
        {
          $lookup: {
            from: "department",
            let: { departmentId: "$departmentId" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$departmentId"] } } },
            ],
            as: "departmentId"
          }
        },
        {
          $addFields: {
            departmentId: {
              $ifNull: [{ $arrayElemAt: ["$departmentId", 0] }, {}]
            }
          }
        },
        { $skip: skip },
        { $limit: pagination.limit },
      ]
      result = this.model.aggregate(a)
    } catch (error) {
      console.log('error....', error)
    }
    return result
  }

  getCountUsingRole(query: any): any {
    let result: any
    try {
      let a = [
        {
          $match: {
            $and: [
              { businessId: new mongoose.Types.ObjectId(query.businessId as any) },
              { roleId: new mongoose.Types.ObjectId(query.roleId as any) }
            ]
          },
        },

      ]
      result = this.model.aggregate(a)
    } catch (error) {
      console.log('error....getCountUsingRole.', error)
    }
    return result
  }

  findeOneByHash(query: any): Promise<any> {
    return this.model.
      findOne(query)
      .select('email _id businessId isinvitationHashExpired invitationHashExpiryDate')
      .lean()
      .exec();
  }

  async getBusinessScoreCard(businessId: Schema.Types.ObjectId): Promise<any[]> {
    const result = await this.model.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["$businessId", businessId] },
            ]
          }
        }
      },
      {
        $facet: {
          gender: [
            {
              $group: {
                _id: "$gender",
                count: { $sum: 1 }
              }
            }
          ],
          ethnicity: [
            {
              $group: {
                _id: "$ethnicity",
                count: { $sum: 1 }
              }
            }
          ],
          personOfColor: [
            {
              $group: {
                _id: "$personOfColor",
                count: { $sum: 1 }
              }
            }
          ],
          tenure: [
            {
              $group: {
                _id: "$tenure",
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ])

    return result.length ? result[0] : []
  }

  findByIdAndPopulatePassword(id: string): Promise<any> {
    return this.model.
      findById(id)
      .select('email password')
      .lean()
      .exec();
  }

  deletManyUsers(userIds: string[]): Promise<any> {
    return this.model
      .find({ _id: { $in: userIds } })
      .exec()
      .then((foundUsers) => {
        if (foundUsers.length === 0) {
          return [];
        }
        return this.model
          .updateMany(
            { _id: { $in: userIds } },
            { $set: { isDeleted: true } }
          )
          .exec()
          .then(() => {
            return foundUsers;
          });
      });
    // .deleteMany({
    //   $and: [
    //     { businessId: '65952c7253c89704d5867242' },
    //     { email: { $ne: 'jantestclient@mailsac.com' } }
    //   ]
    // })
    // .exec()
  }
  deleteManyWithBusinessId(businessId: string): Promise<any> {
    return this.model.deleteMany({ "createdAt": { $gt: new Date("2023-12-20T11:28:31.783+00:00") }, businessId: businessId })
      .lean()
      .exec();
  }

  findById(id: string): Promise<any> {
    return this.model.
      findById(id)
      .populate('roleId departmentId')
      .lean()
      .exec();
  }

  backupMany(userIds: string[]): Promise<any> {
    return this.model
      .find({ _id: { $in: userIds } })
      .exec()
      .then((backupedUsers) => {
        if (backupedUsers.length === 0) {
          return [];
        }
        return this.model
          .updateMany(
            { _id: { $in: userIds } },
            { $set: { isDeleted: false } },
            { new: true }
          )
          .exec()
          .then(() => {
            return backupedUsers;
          });
      });
  }



  updateProfileView(_id: string): Promise<any> {
    return this.model
      .findByIdAndUpdate(_id, { $inc: { profileViews: 1 } }, { new: true, runValidators: true })
      .lean()
      .exec()
  }



  async updateUserScoreCard(businessId: DatabaseId): Promise<any> {
    const result = await this.model.updateMany(
      {
        $match: { businessId: businessId }
      },
      [
        {
          $addFields: {
            diverse: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$gender", "Female"] },
                    { $ne: ["$ethnicity", "WHITE"] }
                  ]
                },
                true,
                false
              ],
            },
            women: {
              $cond: [
                { $eq: ["$gender", "Female"] },
                true,
                false
              ]
            },
            poc: {
              $cond: [
                { $ne: ["$ethnicity", "WHITE"] },
                true,
                false
              ]
            },
            jobLevel: {
              $cond: [
                {
                  $or: [
                    { $regexMatch: { input: "$position", regex: /^c.{1,2}o$/i } },
                    { $regexMatch: { input: "$position", regex: /\bCHIEF\b(?:\s+\w+){1,2}\s+OFFICER\b/i } },
                    { $regexMatch: { input: "$position", regex: /PRESIDENT/i } },
                    { $regexMatch: { input: "$position", regex: /EXECUTIVE VICE PRESIDENT/i } },
                    { $regexMatch: { input: "$position", regex: /EVP/i } },
                    { $regexMatch: { input: "$position", regex: /CHAIRMAN/i } },
                  ]
                },
                "EXECUTIVE",
                {
                  $cond: [
                    {
                      $or: [
                        { $regexMatch: { input: "$position", regex: /VICE PRESIDENT/i } },
                        { $regexMatch: { input: "$position", regex: /\bVP\b/i } },
                        { $regexMatch: { input: "$position", regex: /\bPARTNER\b/i } },
                      ]
                    },
                    "VICE PRESIDENT",
                    {
                      $cond: [
                        {
                          $or: [
                            { $regexMatch: { input: "$position", regex: /\bDIRECTOR\b/i } }
                          ]
                        },
                        "DIRECTOR",
                        {
                          $cond: [
                            {
                              $or: [
                                { $regexMatch: { input: "$position", regex: /\bMANAGER\b/i } },
                                { $regexMatch: { input: "$position", regex: /ASSOCIATE ATTORNEY/i } },
                                { $regexMatch: { input: "$position", regex: /MANAGEMENT/i } },
                                { $regexMatch: { input: "$position", regex: /SUPERVISOR/i } },
                                { $regexMatch: { input: "$position", regex: /LEAD/i } },
                              ]
                            },
                            "MANAGER",
                            {
                              $cond: [
                                {
                                  $or: [
                                    { $regexMatch: { input: "$position", regex: /\bSENIOR\b/i } },
                                    { $regexMatch: { input: "$position", regex: /CORPORATE COUNSEL/i } },
                                  ]
                                },
                                "SENIOR-LEVEL",
                                {
                                  $cond: [
                                    {
                                      $or: [
                                        { $regexMatch: { input: "$position", regex: /\bANALYST\b/i } },
                                        { $regexMatch: { input: "$position", regex: /\bJUNIOR\b/i } },
                                        { $regexMatch: { input: "$position", regex: /\bASSISTANT\b/i } },
                                        { $regexMatch: { input: "$position", regex: /\bCOORDINATOR\b/i } },
                                        { $regexMatch: { input: "$position", regex: /\bREPRESENTATIVE\b/i } },
                                        { $regexMatch: { input: "$position", regex: /\bLEGAL SECRETARY\b/i } },
                                        { $regexMatch: { input: "$position", regex: /\bCLERK\b/i } },

                                        { $regexMatch: { input: "$position", regex: /\bTRAINEE\b/i } },
                                      ]
                                    },
                                    "ENTRY-LEVEL",
                                    "MID-LEVEL"
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
              // $regexMatch: { input: "$Job Title - Current", regex: /line/ } 
            }
          }
        }
      ]);

    return result
    // Job Level formula
    // Satisfaction rating is given in file
    // Tenure can be calulated using Service Date or Hire Date
    // Performance rating is given in file
  }



  async getScorecardStats(businessId: DatabaseId, query: { category: string, culture_group: string }): Promise<any> {
    let result;
    if (query.category === "all") {
      result = await this.model.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$businessId", businessId] },
              ]
            },
            isDeleted: false
          }
        },
        {
          $group: {
            _id: null,
            diverse: { $sum: { $cond: { if: { $eq: ["$diverse", true] }, then: 1, else: 0 } } },
            women: { $sum: { $cond: { if: { $eq: ["$women", true] }, then: 1, else: 0 } } },
            poc: { $sum: { $cond: { if: { $eq: ["$poc", true] }, then: 1, else: 0 } } },
            total: { $sum: 1 }
          }
        },
        {
          $addFields: {
            diverse_per: { $round: [{ $multiply: [{ $divide: ["$diverse", "$total"] }, 100] }, 2] },
            women_per: { $round: [{ $multiply: [{ $divide: ["$women", "$total"] }, 100] }, 2] },
            poc_per: { $round: [{ $multiply: [{ $divide: ["$poc", "$total"] }, 100] }, 2] },
          }
        },
        {
          $unset: ["_id"]
        },
        {
          $addFields: {
            men: { $subtract: ["$total", "$women"] },
            white: { $subtract: ["$total", "$poc"] },
          }
        },
        {
          $addFields: {
            men_per: { $round: [{ $multiply: [{ $divide: ["$men", "$total"] }, 100] }, 2] },
            white_per: { $round: [{ $multiply: [{ $divide: ["$white", "$total"] }, 100] }, 2] },
          }
        }
      ])
      return result[0]
    }
    else {
      result = await this.model.aggregate([
        {
          // Value selected from 1st dropdown(All Culture Groups), if no value is selected leave this empty
          $match: {
            $expr: {
              $and: [
                { $eq: ["$businessId", businessId] },
                query.culture_group === "women" ? { $eq: ["$women", true] } : {},
                query.culture_group === "poc" ? { $eq: ["$poc", true] } : {},
              ]
            }
          }
        },
        {
          $addFields: {
            tenure: {
              $dateDiff: {
                startDate: "$hireDate",
                endDate: new Date(),
                unit: "month"
              }
            },
          }
        },
        {
          $addFields: {
            tenureBracket: {
              $cond: {
                if: {
                  $lt: [
                    "$tenure",
                    12
                  ]
                },
                then: "Less than an year",
                else: {
                  $cond: {
                    if: {
                      $and: [
                        {
                          $gte: [
                            "$tenure",
                            12
                          ]
                        },
                        {
                          $lte: [
                            "$tenure",
                            36
                          ]
                        }
                      ]
                    },
                    then: "1 - 3 years",
                    else: {
                      $cond: {
                        if: {
                          $and: [
                            {
                              $gt: [
                                "$tenure",
                                36
                              ]
                            },
                            {
                              $lte: [
                                "$tenure",
                                72
                              ]
                            }
                          ]
                        },
                        then: "3 - 6 years",
                        else: {
                          $cond: {
                            if: {
                              $and: [
                                {
                                  $gt: [
                                    "$tenure",
                                    72
                                  ]
                                },
                                {
                                  $lte: [
                                    "$tenure",
                                    120
                                  ]
                                }
                              ]
                            },
                            then: "6 - 10 years",
                            else: "10 or more years"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
        },
        {
          $facet: {
            total: [
              {
                $count: "count"
              }
            ],
            jobLevel: [
              {
                $group: {
                  _id: "$jobLevel",
                  count: { $sum: 1 }
                }
              },
              {
                $project: {
                  _id: 0,
                  jobLevel: "$_id",
                  count: 1
                }
              }
            ],
            satisfactionLevel: [
              {
                $group: {
                  _id: "$satisfactionLevel",
                  count: { $sum: 1 }
                }
              },
              {
                $project: {
                  _id: 0,
                  satisfactionLevel: "$_id",
                  count: 1
                }
              }
            ],
            performanceLevel: [
              {
                $group: {
                  _id: "$performanceLevel",
                  count: { $sum: 1 }
                }
              },
              {
                $project: {
                  _id: 0,
                  performanceLevel: "$_id",
                  count: 1
                }
              }
            ],
            tenureBracket: [
              {
                $group: {
                  _id: "$tenureBracket",
                  count: { $sum: 1 }
                }
              },
              {
                $project: {
                  _id: 0,
                  tenureBracket: "$_id",
                  count: 1
                }
              }
            ]
          }
        },
        {
          $addFields: {
            jobLevel: {
              $map: {
                input: "$jobLevel",
                as: "level",
                in: {
                  $mergeObjects: ["$$level", { "percentage": { $round: [{ $multiply: [{ $divide: ["$$level.count", { $arrayElemAt: ["$total.count", 0] }] }, 100] }, 2] }, }]
                }
              }
            },
            satisfactionLevel: {
              $map: {
                input: "$satisfactionLevel",
                as: "level",
                in: {
                  $mergeObjects: ["$$level", { "percentage": { $round: [{ $multiply: [{ $divide: ["$$level.count", { $arrayElemAt: ["$total.count", 0] }] }, 100] }, 2] }, }]
                }
              }
            },
            performanceLevel: {
              $map: {
                input: "$performanceLevel",
                as: "level",
                in: {
                  $mergeObjects: ["$$level", { "percentage": { $round: [{ $multiply: [{ $divide: ["$$level.count", { $arrayElemAt: ["$total.count", 0] }] }, 100] }, 2] }, }]
                }
              }
            },
            tenureBracket: {
              $map: {
                input: "$tenureBracket",
                as: "level",
                in: {
                  $mergeObjects: ["$$level", { "percentage": { $round: [{ $multiply: [{ $divide: ["$$level.count", { $arrayElemAt: ["$total.count", 0] }] }, 100] }, 2] }, }]
                }
              }
            },
            total: {
              $arrayElemAt: ["$total.count", 0]
            }
          }
        }
      ]);
      return result[0]
    }
  }


  getAllBusinessUsersForChat(businessId: DatabaseId, page: number, limit: number): any {
    const skip = (page - 1) * limit;
    const result = this.model.aggregate([
      {
        $match: {
          businessId: businessId,
        }
      },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "roles",
          let: { roleId: "$roleId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$roleId"] },
                  ]
                }
              }
            }
          ],
          as: "roleId"
        }
      },
      {
        $addFields: {
          roleId: {
            $ifNull: [{ $arrayElemAt: ["$roleId", 0] }, {}]
          }
        }
      },
    ]);

    return result
  }
  
  deleteAllUsersExceptAdmin(businessId: DatabaseId, userId: DatabaseId): Promise<any> {
    return this.model
      .deleteMany({
        businessId: businessId,
        _id: { $ne: userId }
      })
      .exec()
  }

}
