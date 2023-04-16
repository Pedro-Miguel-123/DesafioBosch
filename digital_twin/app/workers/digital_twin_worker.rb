require 'bunny'

class DigitalTwinWorker
  include Sneakers::Worker

  from_queue 'digital_twin_queue'

  def work(raw_data)
    dt_data = JSON.parse(raw_data)

    dt = DigitalTwin.new(dt_data)
    if dt.save
      ack!
    else
      requeue!
    end
  end
end