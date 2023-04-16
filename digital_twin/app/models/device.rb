class Device
  include Mongoid::Document
  include Mongoid::Timestamps

  field :function_list, type: String
  field :date, type: String
  field :description, type: String
  field :status, type: Hash
  field :user_id, type: Integer
end
