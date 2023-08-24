import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Response } from 'express';
import * as _ from 'lodash';
import { LocalsService } from 'src/services/locals/locals.service';
import { Repository } from 'typeorm';
import { RecordService } from '../record/record.service';
import { Subscriptionreceipt } from '../subscription-receipt/subscription-receipt.entity';
import { Media } from './media.entity';

@Injectable()
export class MediaService extends TypeOrmCrudService<Media> {
  constructor(
    @InjectRepository(Media) public repo: Repository<Media>,
    @InjectRepository(Subscriptionreceipt)
    public subRepo: Repository<Subscriptionreceipt>,
    public recordService: RecordService,
    private localService: LocalsService,
  ) {
    super(repo);
  }

  async recursivelySignRecordURLS(media: Media) {
    if (media.record) await this.recordService.signURL(media.record);

    for (const child of media?.children) {
      await this.recursivelySignRecordURLS(child);
    }

    return media;
  }

  async recursivelyEnforceMediaRestrictions(
    res: Response,
    media: Media,
  ): Promise<Media | null> {
    // If we cant view this return null
    if (!(await this.checkMediaPerms(res, media))) return null;

    // Recursively check the children
    if (media?.children?.length) {
      for (let i = 0; i < media.children.length; ++i) {
        media.children[i] = await this.recursivelyEnforceMediaRestrictions(
          res,
          media.children[i],
        );
      }

      media.children = _.compact(media.children);
    }

    // return ourselves
    return media;
  }

  async checkMediaPerms(res: Response, media: Media) {
    const user = this.localService.getUser(res);
    if (media.owner === user.id) return true;
    if (!media.mediaRestriction?.length) return true;

    // Check all subs
    for (const restriction of media.mediaRestriction) {
      if (restriction.userDenied && restriction.userDenied.id === user.id)
        return false;

      if (
        restriction.roleId &&
        !user.roles.find((x) => x.role === restriction.roleId)
      )
        return false;

      if (restriction.subscriptionId) {
        if (
          !(await this.subRepo.count({
            owner: user.id,
            subscription: restriction.subscriptionId,
          }))
        )
          return false;
      }
    }

    // We made it here we must have access
    return true;
  }
}
