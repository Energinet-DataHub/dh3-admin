import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

declare global {
  // Intentional extension of `jest` namespace
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      /**
       * Verifies than an NgModule cannot be imported directly, that is it
       * defers to a static method such as `forRoot` for registration.
       */
      toGuardAgainstDirectImport(): R;
      /**
       * Verifies that a root NgModule cannot be registered in multiple
       * injectors.
       */
      toGuardAgainstMultipleInjectorRegistration(): R;
    }
  }
}

export function addNgModuleMatchers(): void {
  expect.extend({
    toGuardAgainstDirectImport<TModule>(ngModuleType: Type<TModule>) {
      let didThrow = false;
      let errorMessage = '';

      try {
        TestBed.configureTestingModule({
          imports: [ngModuleType],
        });

        TestBed.inject<TModule>(ngModuleType);
      } catch (error) {
        didThrow = true;
        errorMessage = error?.message ?? String(error);
      }

      const isPassing = didThrow;

      return isPassing
        ? {
            message: () =>
              `did not expect NgModule "${ngModuleType.name}" to be guarded against direct import`,
            pass: true,
          }
        : {
            message: () =>
              `expected NgModule "${ngModuleType.name}" to be guarded against direct import` +
              (errorMessage ? `. Error: ${errorMessage}` : ''),
            pass: false,
          };
    },
  });

  expect.extend({
    toGuardAgainstMultipleInjectorRegistration<TRootModule>(
      rootNgModuleType: Type<TRootModule>
    ) {
      const optionalAngularDependency = null;
      let didRootInstanceThrow = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let rootInjectorInstance: TRootModule = {} as any;

      try {
        rootInjectorInstance = new rootNgModuleType(optionalAngularDependency);
      } catch (error: unknown) {
        didRootInstanceThrow = true;
      }

      let didDuplicateInstanceThrow = false;

      try {
        new rootNgModuleType(rootInjectorInstance);
      } catch (error: unknown) {
        didDuplicateInstanceThrow = true;
      }

      const isPassing = !didRootInstanceThrow && didDuplicateInstanceThrow;

      return isPassing
        ? {
            message: () =>
              `did not expect root-level NgModule "${rootNgModuleType.name}" to guard against accidental duplication`,
            pass: true,
          }
        : {
            message: () =>
              didRootInstanceThrow
                ? `did not expect root-level NgModule "${rootNgModuleType.name}" to guard the root-level injector`
                : `expected root-level NgModule "${rootNgModuleType.name}" to be guarded against accidential duplication`,
            pass: false,
          };
    },
  });
}
