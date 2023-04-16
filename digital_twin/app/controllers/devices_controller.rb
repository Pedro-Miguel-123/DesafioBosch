class DevicesController < ApplicationController
    skip_before_action :verify_authenticity_token

    def index
        render json: Device.where(user_id: params[:user_id])
    end
    
    def show
        render json: Device.find(params[:id])
    end
    
    def create
        dt = Device.new(device_params)
        if dt.save
        render json: dt, status: :created
        else
        render json: dt.errors, status: :unprocessable_entity
        end
    end

    def operate
        dev = Device.find(params[:id])
        status = dev.status

        if params[:operation] == 'Power'
            status[:active] = !status[:active]
        elsif params[:operation] == 'Up'
            status[:temp] += 1
        elsif params[:operation] == 'Down'
            status[:temp] -= 1
        end

        dev.save

        render json: dev, status: :ok
    end

    def update
        dev = Device.find(params[:id])
        if dev && dev.user_id.nil?
            dev.update(user_id: device_params[:user_id])
            render json: dev, status: :ok
        else
            render json: dev.errors, status: :unprocessable_entity
        end
    end
    
    private
    
    def device_params
        params.require(:device).permit(:function_list, :date, :description, :status, :user_id)
    end
end
