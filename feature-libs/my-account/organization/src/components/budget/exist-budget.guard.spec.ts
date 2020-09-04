import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Budget, BudgetService, SemanticPathService } from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { ExistBudgetGuard } from './exist-budget.guard';

const BUDGET_VALID = Object.freeze({ code: 'budgetCode' });
const BUDGET_INVALID = Object.freeze({});

class BudgetServiceStub {
  get(): Observable<Budget> {
    return of();
  }
}

class SemanticPathServiceStub {
  get(): string {
    return 'budgets';
  }
  transform(): string[] {
    return ['organization', 'budgets'];
  }
}

const mockRouter = { parseUrl: () => {} };

describe('ExistBudgetGuard', () => {
  let existBudgetGuard: ExistBudgetGuard;
  let router: Router;
  let budgetService: BudgetService;
  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BudgetService,
          useClass: BudgetServiceStub,
        },
        {
          provide: Router,
          useValue: mockRouter,
        },

        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { code: 'budgetCode' } } },
        },
        {
          provide: SemanticPathService,
          useClass: SemanticPathServiceStub,
        },
      ],
      imports: [RouterTestingModule],
    });

    existBudgetGuard = TestBed.inject(ExistBudgetGuard);
    router = TestBed.inject(Router);
    budgetService = TestBed.inject(BudgetService);
    route = TestBed.inject(ActivatedRoute);
  });

  describe('canActivate:', () => {
    beforeEach(() => {
      spyOn(router, 'parseUrl');
    });

    describe('when budget is loaded', () => {
      beforeEach(() => {
        spyOn(budgetService, 'get').and.returnValue(of(BUDGET_VALID));
      });

      it('then router should not redirect', () => {
        existBudgetGuard.canActivate(route.snapshot).subscribe().unsubscribe();

        expect(router.parseUrl).not.toHaveBeenCalled();
      });

      it('then returned observable should emit true', () => {
        let emittedValue;

        existBudgetGuard
          .canActivate(route.snapshot)
          .subscribe((result) => (emittedValue = result))
          .unsubscribe();

        expect(emittedValue).toBe(true);
      });
    });

    describe('when budget is not loaded', () => {
      beforeEach(() => {
        spyOn(budgetService, 'get').and.returnValue(of(BUDGET_INVALID));
      });

      it('then router should redirect to budget list page', () => {
        existBudgetGuard.canActivate(route.snapshot).subscribe().unsubscribe();

        expect(router.parseUrl).toHaveBeenCalledWith('budgets');
      });
    });
  });
});
