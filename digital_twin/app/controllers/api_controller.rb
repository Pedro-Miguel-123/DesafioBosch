class ApiController < ApplicationController

    def index
        render json: Device.collection
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
    
    private
    
    def device_params
        params.require(:device).permit(:function_list, :date, :description, :status)
    end
end
