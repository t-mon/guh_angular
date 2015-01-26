// Base wizard by: https://github.com/smsohan/angular_wizard/blob/master/main.js
// Added external controls (next, prev, hasNext, hasPrev)

// execution sequence
// 1. compile
// 2. controller
// 3. pre-link
// 4. post-link
// more info: http://www.jvandemo.com/the-nitty-gritty-of-compile-and-link-functions-inside-angularjs-directives
// more info: http://odetocode.com/blogs/scott/archive/2014/05/28/compile-pre-and-post-linking-in-angularjs.aspx
(function(){
  "use strict";

  angular
    .module('guh.components.ui')
    .directive('guhWizard', wizardDirective);

  wizardDirective.$inject = [];

  function wizardDirective() {

    var directive = {
      // compile: WizardCompile,
      controller: WizardController,
      controllerAs: 'wizardControl',
      link: wizardLink,
      // replace: true,
      restrict: 'E',
      scope: {
        control: '=',
        // onBeforeStepCahnge: '&',
        // onStepCahnge: '&',
        // onAfterStepCahnge: '&',
        title: '@'
      },
      templateUrl: 'components/directives/wizard/wizard.html',
      transclude: true
    };

    // read why this does not work: http://www.bennadel.com/blog/2447-exploring-directive-controllers-compiling-linking-and-priority-in-angularjs.htm#comments_43758
    // function WizardCompile(templateElement, templateAttributes) {
    //   templateElement.addClass('test');
    // }

    WizardController.$inject = [];

    function WizardController() {
      var guh = this;

      // Adding object for internal controls
      guh.internal = {};
      guh.internal.steps = [];

      guh.internal.addStep = function(step) {
        guh.internal.steps.push(step);
      };

      guh.internal.toggleSteps = function(showIndex) {
        // var event = {event: {fromStep: $scope.currentStepIndex, toStep: showIndex}};

        // if($scope.onBeforeStepChange){
        //   $scope.onBeforeStepChange(event);
        // }
        guh.internal.steps[guh.internal.currentStepIndex].currentStep = false;

        // if($scope.onStepChanging){
        //   $scope.onStepChanging(event);
        // }
        guh.internal.currentStepIndex = showIndex;

        guh.internal.steps[guh.internal.currentStepIndex].currentStep = true;
        // if($scope.onAfterStepChange){
        //   $scope.onAfterStepChange(event);
        // }
      };
    }

    function wizardLink(scope, element) {
      // TODO: can this be extracted to compile-function? is it possible to have compile AND link function in directive?
      element.addClass('wizard');

      // Allows wizard to be controlled from the outside (e.g. from devices-add-controller.js)
      scope.wizardControl.external = scope.control || {};

      // Check if there are any steps in the wizard
      if(scope.wizardControl.internal.steps.length !== 0) {
        scope.wizardControl.internal.currentStepIndex = 0;
        scope.wizardControl.internal.steps[scope.wizardControl.internal.currentStepIndex].currentStep = true;
      }

      scope.wizardControl.external.next = function() {
        if(scope.wizardControl.external.hasNext()) {
          scope.wizardControl.internal.toggleSteps(scope.wizardControl.internal.currentStepIndex + 1);
        }
      };

      scope.wizardControl.external.prev = function() {
        if(scope.wizardControl.external.hasPrev) {
          scope.wizardControl.internal.toggleSteps(scope.wizardControl.internal.currentStepIndex - 1);
        }
      };

      scope.wizardControl.external.hasNext = function() {
        return scope.wizardControl.internal.currentStepIndex < (scope.wizardControl.internal.steps.length - 1);
      };

      scope.wizardControl.external.hasPrev = function() {
        return scope.wizardControl.internal.currentStepIndex > 0;
      };
    }

    return directive;

  }

}());