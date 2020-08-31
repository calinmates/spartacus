import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import {
  B2BUserAdapter,
  B2B_USER_NORMALIZER,
  B2B_USERS_NORMALIZER,
} from '../../../connectors/b2b-user';
import { PERMISSIONS_NORMALIZER } from '../../../connectors/permission';
import { USER_GROUPS_NORMALIZER } from '../../../connectors/user-group/converters';
import { UserGroup } from '../../../model/user-group.model';
import {
  OccEndpointsService,
  ConverterService,
  B2BUser,
  Occ,
  EntitiesModel,
} from '@spartacus/core';
import { B2BSearchConfig } from '../../../model';

@Injectable()
export class OccB2BUserAdapter implements B2BUserAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {}

  load(userId: string, orgUnitCustomerId: string): Observable<B2BUser> {
    return this.http
      .get<Occ.B2BUser>(this.getB2BUserEndpoint(userId, orgUnitCustomerId))
      .pipe(this.converter.pipeable(B2B_USER_NORMALIZER));
  }

  loadList(
    userId: string,
    params?: B2BSearchConfig
  ): Observable<EntitiesModel<B2BUser>> {
    return this.http
      .get<Occ.OrgUnitUserList>(this.getB2BUsersEndpoint(userId, params))
      .pipe(this.converter.pipeable(B2B_USERS_NORMALIZER));
  }

  create(userId: string, orgCustomer: B2BUser): Observable<B2BUser> {
    return this.http
      .post<Occ.B2BUser>(this.getB2BUsersEndpoint(userId), orgCustomer)
      .pipe(this.converter.pipeable(B2B_USER_NORMALIZER));
  }

  update(
    userId: string,
    orgCustomerId: string,
    orgCustomer: B2BUser
  ): Observable<B2BUser> {
    return this.http
      .patch<Occ.B2BUser>(
        this.getB2BUserEndpoint(userId, orgCustomerId),
        orgCustomer
      )
      .pipe(this.converter.pipeable(B2B_USER_NORMALIZER));
  }

  loadApprovers(
    userId: string,
    orgCustomerId: string,
    params?: B2BSearchConfig
  ): Observable<EntitiesModel<B2BUser>> {
    return this.http
      .get<Occ.OrgUnitUserList>(
        this.getApproversEndpoint(userId, orgCustomerId, params)
      )
      .pipe(this.converter.pipeable(B2B_USERS_NORMALIZER));
  }

  assignApprover(
    userId: string,
    orgCustomerId: string,
    approverId: string
  ): Observable<any> {
    return this.http.post<any>(
      this.getApproverEndpoint(userId, orgCustomerId, approverId),
      null
    );
  }

  unassignApprover(
    userId: string,
    orgCustomerId: string,
    approverId: string
  ): Observable<any> {
    return this.http.delete<any>(
      this.getApproverEndpoint(userId, orgCustomerId, approverId)
    );
  }

  loadPermissions(
    userId: string,
    orgCustomerId: string,
    params?: B2BSearchConfig
  ): Observable<EntitiesModel<B2BUser>> {
    return this.http
      .get<Occ.OrgUnitUserList>(
        this.getPermissionsEndpoint(userId, orgCustomerId, params)
      )
      .pipe(this.converter.pipeable(PERMISSIONS_NORMALIZER));
  }

  assignPermission(
    userId: string,
    orgCustomerId: string,
    permissionId: string
  ): Observable<any> {
    return this.http.post<any>(
      this.getPermissionEndpoint(userId, orgCustomerId, permissionId),
      null
    );
  }

  unassignPermission(
    userId: string,
    orgCustomerId: string,
    permissionId: string
  ): Observable<any> {
    return this.http.delete<any>(
      this.getPermissionEndpoint(userId, orgCustomerId, permissionId)
    );
  }

  loadUserGroups(
    userId: string,
    orgCustomerId: string,
    params?: B2BSearchConfig
  ): Observable<EntitiesModel<UserGroup>> {
    return this.http
      .get<Occ.OrgUnitUserList>(
        this.getUserGroupsEndpoint(userId, orgCustomerId, params)
      )
      .pipe(this.converter.pipeable(USER_GROUPS_NORMALIZER));
  }

  assignUserGroup(
    userId: string,
    orgCustomerId: string,
    userGroupId: string
  ): Observable<any> {
    return this.http.post<any>(
      this.getUserGroupEndpoint(userId, orgCustomerId, userGroupId),
      null
    );
  }

  unassignUserGroup(
    userId: string,
    orgCustomerId: string,
    userGroupId: string
  ): Observable<any> {
    return this.http.delete<any>(
      this.getUserGroupEndpoint(userId, orgCustomerId, userGroupId)
    );
  }

  protected getB2BUserEndpoint(userId: string, orgCustomerId: string): string {
    return this.occEndpoints.getUrl('b2bUser', {
      userId,
      orgCustomerId,
    });
  }

  protected getB2BUsersEndpoint(
    userId: string,
    params?: B2BSearchConfig
  ): string {
    return this.occEndpoints.getUrl('b2bUsers', { userId }, params);
  }

  protected getApproverEndpoint(
    userId: string,
    orgCustomerId: string,
    approverId: string
  ): string {
    return this.occEndpoints.getUrl('b2bUserApprover', {
      userId,
      orgCustomerId,
      approverId,
    });
  }

  protected getApproversEndpoint(
    userId: string,
    orgCustomerId: string,
    params?: B2BSearchConfig | { orgCustomerId: string }
  ): string {
    return this.occEndpoints.getUrl(
      'b2bUserApprovers',
      { userId, orgCustomerId },
      params
    );
  }

  protected getPermissionEndpoint(
    userId: string,
    orgCustomerId: string,
    premissionId: string
  ): string {
    return this.occEndpoints.getUrl('b2bUserPermission', {
      userId,
      orgCustomerId,
      premissionId,
    });
  }

  protected getPermissionsEndpoint(
    userId: string,
    orgCustomerId: string,
    params?: B2BSearchConfig
  ): string {
    return this.occEndpoints.getUrl(
      'b2bUserPermissions',
      {
        userId,
        orgCustomerId,
      },
      params
    );
  }

  protected getUserGroupEndpoint(
    userId: string,
    orgCustomerId: string,
    userGroupId: string
  ): string {
    return this.occEndpoints.getUrl('b2bUserUserGroup', {
      userId,
      orgCustomerId,
      userGroupId,
    });
  }

  protected getUserGroupsEndpoint(
    userId: string,
    orgCustomerId: string,
    params?: B2BSearchConfig
  ): string {
    return this.occEndpoints.getUrl(
      'b2bUserUserGroups',
      { userId, orgCustomerId },
      params
    );
  }
}