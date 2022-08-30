angular.module('myApp').component('customModal', {
    template: `<div class="modal d-block" role="dialog" aria-labelledby="myModalLabel">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 id="myModalLabel">{{ $ctrl.modalTitle }}</h5>
                                    <button type="button" class="close" data-dismiss="modal" ng-click="$ctrl.closeCustomModal()">×</button>
                                </div>
                                <div class="modal-body">
                                    <p>{{ $ctrl.currentMessage }}</p>
                                </div>
                                <div class="modal-footer">
                                    <button class="btn btn-secondary" data-dismiss="modal" ng-click="$ctrl.closeCustomModal()">{{ $ctrl.btnText }}
                                     <i ng-if="$ctrl.btnIcon" class={{$ctrl.btnIcon}}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>`,
    bindings: {
        modalTitle: '@',
        currentMessage: '@',
        closeCustomModal: '&',
        btnText: '@',
        btnIcon: '@'
    },
    controller: function () {
    },
})