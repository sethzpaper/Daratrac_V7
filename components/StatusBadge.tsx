
import React from 'react';
import { Status, DirectorStatus } from '../types';
import { CheckCircleIcon, XCircleIcon, ClockIcon, MinusCircleIcon } from './icons';

interface StatusBadgeProps {
    status: Status | DirectorStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    let iconColor = 'text-gray-500';
    let IconComponent = ClockIcon;

    switch (status) {
        case Status.Approved:
        case DirectorStatus.Approved:
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            iconColor = 'text-green-500';
            IconComponent = CheckCircleIcon;
            break;
        case Status.Rejected:
        case DirectorStatus.Rejected:
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            iconColor = 'text-red-500';
            IconComponent = XCircleIcon;
            break;
        case Status.Pending:
            bgColor = 'bg-gray-100';
            textColor = 'text-gray-800';
            iconColor = 'text-gray-500';
            IconComponent = ClockIcon;
            break;
        case DirectorStatus.InProgress:
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            iconColor = 'text-yellow-500';
            IconComponent = ClockIcon;
            break;
        case Status.NotApplicable:
            bgColor = 'bg-blue-100';
            textColor = 'text-blue-800';
            iconColor = 'text-blue-500';
            IconComponent = MinusCircleIcon;
            break;
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
            <IconComponent className={`mr-1.5 h-4 w-4 ${iconColor}`} />
            {status}
        </span>
    );
};

export default StatusBadge;
