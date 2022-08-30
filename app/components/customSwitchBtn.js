angular.module('myApp').component('customSwitchBtn', {
    template: `
<style>
.switch-outer-container {
    display: flex;
    align-items: center;
    align-content: center;
    text-align: center;
    justify-content: space-between;
}

.switch-text {
    color: white;
    margin-left: 5px;
}

.switch-container {
    position: relative;
    display: inline-block;
    align-items: center;
    width: 60px;
    height: 34px;
    top: 3px;
}

/* Hides default HTML checkbox */
.switch-container input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
}

input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}

/*standard version*/
.switch-input-blue:checked + .slider {
    background-color: #2196F3;
}

.switch-input-blue:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
}

/*success version*/
.switch-input-green:checked + .slider {
    background-color: #1fc40f;
}

.switch-input-green:focus + .slider {
    box-shadow: 0 0 1px #1fc40f;
}

/*warning version*/
.switch-input-yellow:checked + .slider {
    background-color: #ffce23;
}

.switch-input-yellow:focus + .slider {
    box-shadow: 0 0 1px #ffce23;
}

/*danger version*/
.switch-input-red:checked + .slider {
    background-color: #f32148;
}

.switch-input-red:focus + .slider {
    box-shadow: 0 0 1px #f32148;
}
</style>

<div class="switch-outer-container">
    <label class="switch-container">
        <input type="checkbox" ng-model="$ctrl.switchValue" ng-change="$ctrl.onToggle()" ng-class="$ctrl.color ? 'switch-input-' + $ctrl.color : 'switch-input-blue'">
        <span class="slider round"></span>
    </label>
     <div ng-if="$ctrl.label && $ctrl.label.length" class="switch-text" data-toggle="tooltip" data-html="true" title={{$ctrl.switchTooltip}}>
        <b>{{ $ctrl.label }}</b>
    </div>
</div>`,
    bindings: {
        label: '@',
        color: '@',
        switchValue: '=',
        onToggle: '=',
        switchTooltip: '@',
    },
    controller: function () {
    },
})

